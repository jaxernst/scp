pragma solidity ^0.8.0;

import "./RewardDistributor.sol";
import "hardhat/console.sol";

interface IAlarmPool {
    struct UserAlarm {
        bool on;
        uint256 amountStaked;
        uint8[] activeOnDays; // 1 = Monday -> 7 = Sunday
        uint32[] wakeCountArr; // Array of length 7 to count wakeups for each day of the week
        uint256 activationTime; // The time the user's alarm became active (rounded to last wakeup)
        int256 timezoneOffset;
    }

    function totalWakeupCount(address) external returns (uint);

    function missedWakeups(address) external returns (uint);

    function getUserAmountStaked(address) external returns (uint);
}

contract AlarmPool is IAlarmPool {
    uint32 SECONDS_PER_DAY = 86400; // hardcode for gas saving

    uint16 public missedWakeupPenalty; // penalty taken for each missed wakeup (bps)
    uint16 public poolEntryFee = 500; // pool fee in basis points (bps)

    uint256 wakeupWindowDuration = 1 hours; // Before wake time
    uint256 wakeupTimeOfDay; // seconds

    address public factory;
    IAlarmPoolRewardDistributor rewardDistributor;

    mapping(address => UserAlarm) public userAlarms;

    /**
     * @param _missedWakeupPenaltyBps Basis point penalty for each missed wakeup
     * @param _wakeupTimeOfDaySeconds Wakeup time of day in seconds after midnight
     */
    constructor(uint16 _missedWakeupPenaltyBps, uint256 _wakeupTimeOfDaySeconds)
    {
        factory = msg.sender;
        rewardDistributor = new AlarmPoolRewardDistributor();
        missedWakeupPenalty = _missedWakeupPenaltyBps;

        wakeupTimeOfDay = _wakeupTimeOfDaySeconds;
    }

    /*** Public functions ***/

    /**
     * Enter the alarm pool and begin enforcing wakeups.
     * @notice Joining the alarm pool comes with a fee, and the fee is proportional to
     * the total amount put at stake. This is done to prevent users from staking
     * unreasonably large amounts due to reward payouts being proprotional to amount staked
     * @param _activeOnDays An array identifying what days of the week the alarm will
     * be active. Array values can range from 1 (Monday) to 7 (Sunday), and cannot
     * have a length greater than 7
     * @param _timezoneOffsetHours The user's timezone offset in hours from UTC time
     */
    function joinPool(uint8[] memory _activeOnDays, int _timezoneOffsetHours)
        public
        payable
    {
        require(msg.value > 0, "Must send value to stake when joining pool");
        require(_validateDaysArr(_activeOnDays), "activeOnDays array invalid");
        require(
            userAlarms[msg.sender].activationTime == 0,
            "User already joined"
        );
        require(
            -12 <= _timezoneOffsetHours && _timezoneOffsetHours <= 12,
            "Timezone offset out of range"
        );

        uint256 fee = (msg.value * poolEntryFee) / 10000;
        int _timezoneOffsetSeconds = _timezoneOffsetHours * 60 * 60;

        userAlarms[msg.sender] = UserAlarm({
            on: true,
            amountStaked: msg.value - fee,
            activeOnDays: _activeOnDays,
            wakeCountArr: new uint32[](7),
            activationTime: 0,
            // Timezone offset only needed get the day of week in user's time zone
            timezoneOffset: _timezoneOffsetSeconds
        });

        userAlarms[msg.sender].activationTime = lastWakeupTimestamp(msg.sender);

        payable(factory).transfer(fee);
    }

    /**
     * Submit a wakeup confirmation within the wakeup window.
     * @notice A wakeup cannot be confirmed if the transaction gets executed after
     * the user's wakeup time (offset for user's timezone).
     */
    function confirmWakeup() public {
        // Do we need to require that today is in the user's wakeup day array?
        // Current thinking is no, as confirmations on this day index won't be
        // considered by the missedWakeups function
        require(userAlarms[msg.sender].on, "User has no active alarm");
        require(_inWakeupWindow(msg.sender), "Not in wakeup window");

        uint8 day = _dayOfWeek(
            _offsetTimestamp(
                block.timestamp,
                userAlarms[msg.sender].timezoneOffset
            )
        );

        userAlarms[msg.sender].wakeCountArr[day] += 1;
    }

    /*
     * Temporarily disable alarm clock. Users cannot be penalized for missed wakeups
     * when their alarm is not on.
     */
    function pauseAlarm() public {
        require(userAlarms[msg.sender].on, "Alarm not active");
        require(
            _deactivationAllowed(msg.sender),
            "Forbidden, user too close to wakeup or has unpenalized missed wakeups"
        );
        userAlarms[msg.sender].on = false;
    }

    /**
     * Continue enforcing wakeups on the days orignally set by the user
     * @notice resuming alarm sets a new activation time as the previous wakeup,
     * so the next wakeup will be enforceable
     */
    function resumeAlarm() public {
        require(!userAlarms[msg.sender].on, "Alarm already active");

        // Reset alarm vars used to track missed wakeups/penalties
        userAlarms[msg.sender].wakeCountArr = new uint32[](7);
        userAlarms[msg.sender].activationTime = lastWakeupTimestamp(msg.sender);
        userAlarms[msg.sender].on = true;
    }

    /**
     * Return the user's staked funds and delete their record from the pool
     */
    function exitPool() public {
        require(
            userAlarms[msg.sender].activationTime != 0,
            "User has not joined the pool"
        );
        require(
            _deactivationAllowed(msg.sender),
            "Forbidden, user too close to wakeup or has unpenalized missed wakeups"
        );

        // Delete user record prior to transferring to protect again reentrancy attacks
        delete userAlarms[msg.sender];
        payable(msg.sender).transfer(userAlarms[msg.sender].amountStaked);
    }

    /**
     * Off-chain software tracks active users and monitors for missed wake-ups. Identifying
     * users that have missed their wake-ups is expensive, and thus this identification process
     * occurs off chain, when a missed wake-up is identified, on data timestamp storage can
     * either confirm or deny the legitimacy of this penalty claim.
     */
    function penalize(address user) public {
        require(userAlarms[user].on, "User alarm not on");

        uint256 numMissedWakeups = this.missedWakeups(user);
        require(numMissedWakeups > 0, "User has not missed any wakeups");

        uint256 penalty = (userAlarms[user].amountStaked *
            numMissedWakeups *
            missedWakeupPenalty) / 10000;

        // Decrease recorded user stake before transferring
        userAlarms[user].amountStaked -= penalty;

        // Reset activation time so users missed wakeups resets to 0
        userAlarms[user].activationTime = lastWakeupTimestamp(user);

        // Transfer user penalty funds to an Escrow contract
        rewardDistributor.depositUserPenalty();
    }

    function totalWakeupCount(address user)
        external
        view
        override
        returns (uint totalWakeups)
    {
        uint8[] memory activeDays = userAlarms[user].activeOnDays;
        totalWakeups = 0;
        for (uint i; i < activeDays.length; i++) {
            totalWakeups += userAlarms[user].wakeCountArr[activeDays[i]];
        }
    }

    /**
     * Determine how many total days have been missed by any given user.
     * @notice missed wakeups if a function of the alarm activation time,
     * the alarm active days, the last wakeup time, an the user's timezone:
     * missedWakeups = f(activationTime, alarmDays, lastWakeupTime, timezoneOffset)
     */
    function missedWakeups(address user)
        external
        view
        override
        returns (uint numMissedWakeups)
    {
        uint8[] memory userActiveDaysArr = userAlarms[user].activeOnDays;
        uint32[] memory userWakeCountArr = userAlarms[user].wakeCountArr;
        uint256 daysPassed = _daysPassed(
            userAlarms[user].activationTime,
            block.timestamp
        );

        // The current day of week is taken from the last wakeup time (timezone adjusted)
        uint256 lastWakeupDayOfWeek = _dayOfWeek(lastWakeupTimestamp(user));

        uint8 activationDay = _dayOfWeek(userAlarms[user].activationTime);

        // The expected amount of wakeups for any given alarm day is at least
        // the amount of weeks elasped.
        uint minWakeups = daysPassed / 7;

        // If the user wakeup count for an active day is less than the expected
        // wakeup count on that day, missedWakeups is incremented by the difference
        numMissedWakeups = 0;
        for (uint i; i < userActiveDaysArr.length; i++) {
            uint8 checkDay = userActiveDaysArr[i];
            uint expectedWakeupsOnThisDay = minWakeups;
            if (activationDay <= checkDay && checkDay <= lastWakeupDayOfWeek) {
                expectedWakeupsOnThisDay++;
            }
            numMissedWakeups +=
                expectedWakeupsOnThisDay -
                uint(userWakeCountArr[checkDay - 1]);
        }
    }

    function getUserAmountStaked(address user)
        external
        view
        override
        returns (uint)
    {
        return userAlarms[user].amountStaked;
    }

    function nextWakeupTimestamp(address user) public view returns (uint256) {
        uint lastMidnight = _lastMidnight(user);

        if (_wakeupPassedToday(user)) {
            return lastMidnight + 1 days + wakeupTimeOfDay;
        } else {
            return lastMidnight + wakeupTimeOfDay;
        }
    }

    function lastWakeupTimestamp(address user) public view returns (uint256) {
        uint lastMidnight = _lastMidnight(user);

        if (_wakeupPassedToday(user)) {
            return lastMidnight + wakeupTimeOfDay;
        } else {
            return lastMidnight - 1 days + wakeupTimeOfDay;
        }
    }

    /*** Private/Internal Functions ***/

    function _lastMidnight(address user) private view returns (uint) {
        uint _now = _offsetTimestamp(
            block.timestamp,
            userAlarms[user].timezoneOffset
        );
        return _now - (_now % SECONDS_PER_DAY);
    }

    function _wakeupPassedToday(address user) private view returns (bool) {
        uint _now = _offsetTimestamp(
            block.timestamp,
            userAlarms[user].timezoneOffset
        );
        return (_now % SECONDS_PER_DAY) > wakeupTimeOfDay;
    }

    function _inWakeupWindow(address user) private view returns (bool) {
        if (_wakeupPassedToday(user)) return false;
        return
            (nextWakeupTimestamp(user) - block.timestamp) <
            wakeupWindowDuration;
    }

    /**
     * Deactivations are not allowed if the next wakeup day is included in the user's
     * alarm, and the current time is within x hours before the next wakeup time.
     * (adjusted for the user's timezone)
     */
    function _deactivationAllowed(address user) internal view returns (bool) {
        return
            this.missedWakeups(user) == 0 &&
            _enforceNextWakeup(user) &&
            !_inWakeupWindow(user);
    }

    function _enforceNextWakeup(address user) internal view returns (bool) {
        // If the day of the pool's next wakeup is in user's activeOnDays array, return true
        uint8 nextWakeupDay = _dayOfWeek(nextWakeupTimestamp(user));
        for (uint i; i < userAlarms[user].activeOnDays.length; i++) {
            if (userAlarms[user].activeOnDays[i] == nextWakeupDay) {
                return true;
            }
        }
        return false;
    }

    // 1 = Monday, 7 = Sunday
    function _dayOfWeek(uint256 timestamp)
        internal
        view
        returns (uint8 dayOfWeek)
    {
        uint256 _days = timestamp / SECONDS_PER_DAY;
        dayOfWeek = uint8(((_days + 3) % 7) + 1);
    }

    function _daysPassed(uint256 fromTime, uint256 toTime)
        internal
        view
        returns (uint256)
    {
        if (toTime < fromTime) return 0;
        return (toTime - fromTime) / SECONDS_PER_DAY;
    }

    function _offsetTimestamp(uint timestamp, int offset)
        internal
        pure
        returns (uint256)
    {
        return uint(int(timestamp) + offset);
    }

    function _validateDaysArr(uint8[] memory daysActive)
        internal
        pure
        returns (bool)
    {
        if (daysActive.length > 7 || daysActive.length == 0) {
            return false;
        }
        for (uint i; i < daysActive.length; i++) {
            if (daysActive[i] == 0 || daysActive[i] > 7) {
                return false;
            }
        }
        return true;
    }
}
