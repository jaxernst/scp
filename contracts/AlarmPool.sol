pragma solidity ^0.8.0;

import './RewardDistributor.sol';

interface ISocialAlarmClock {
    struct UserAlarm {
        bool on;
        uint256 amountStaked;
        uint8[] activeOnDays; // 1 = Monday -> 7 = Sunday
        uint32[] wakeCountArr; // Array of length 7 to count wakeups for each day of the week
        uint256 activationTime; // The time the user's alarm became active (rounded to last wakeup)
    }
    function totalWakeupCount(address) external returns(uint);
    function missedWakeups(address) external returns(uint);
    function getUserAmountStaked(address) external returns(uint);
}


contract AlarmClockPool is ISocialAlarmClock {
    uint32 SECONDS_PER_DAY = 86400; // hardcode for gas saving
   
    /**
     * Alarm pools are timezone specific, so the pool will interpret the current time
     * as the block's timestamp (UTC time) offset by 'timezoneOffset' seconds. (+/- 12 hours)
     * @notice seconds are used to match timestamp format, which reduces computations needed
     * to calculate timezone addjust time.
     */
    int32  public timezoneOffsetSeconds;

    uint8 public missedWakeupPenalty; // penalty taken for each missed wakeup (%)
    uint8 public poolEntryFee = 1; // pool fee (%)
    
    /** 
     * Timezone adjusted starting wakeup time.
     * Determines the pool wakeup time
     */
    uint256 public firstWakeupTimestamp; // Timezone adjusted starting wakeup time 
    
    uint256 wakeupWindowDuration  = 1 hours; // Before wake time

    address public factory;
    IAlarmPoolRewardDistributor rewardDistributor;

    mapping(address => UserAlarm) public userAlarms;

    constructor(
        int8 _timezoneOffsetHours, 
        uint8 _missedWakeupPenaltyPercent,
        uint256 _firstWakeupTime
    ) {
        require(
            -12 <= _timezoneOffsetHours && _timezoneOffsetHours <= 12, 
            "Time offset out of range"
        );
        timezoneOffsetSeconds = _timezoneOffsetHours * 60 * 60;
        factory = msg.sender;
        missedWakeupPenalty = _missedWakeupPenaltyPercent;
        firstWakeupTimestamp = _firstWakeupTime;
        rewardDistributor = new AlarmPoolRewardDistributor();
    }

    /*** Public functions ***/

    /**
     * Enter the alarm pool and begin enforcing wakeups.
     * @notice Joining the alarm pool comes with a fee, and the fee is proptional to 
     * the total amount put at stake. This is done to prevent users from staking
     * unreasonably large amounts. (Reward payouts are proprotional to amount staked) 
     * @param _activeOnDays An array identifying what days of the week the alarm will
     * be active. Array values can range from 1 (Monday) to 7 (Sunday), and cannot
     * have a length greater than 7
     */
    function joinAlarmPool(uint8[] memory _activeOnDays) public payable {
        require(_validateDaysArr(_activeOnDays), "activeOnDays array invalid");
        require(msg.value > 0, "Must send value to stake when joining pool");
        require(userAlarms[msg.sender].activationTime != 0, "User already joined");
        
        uint256 fee = msg.value * poolEntryFee;
        userAlarms[msg.sender] = UserAlarm({
            on: true,
            amountStaked: msg.value - fee,
            activeOnDays: _activeOnDays,
            wakeCountArr: new uint32[](7),
            activationTime: _nextWakeupTime() - 1 days// Round to prev. wakeup timestamp
        });

        payable(factory).transfer(fee);
    }

    /**
     * Submit a wakeup confirmation within the wakeup window.
     * @notice A wakeup cannot be confirmed if the transaction gets executed after the wakeup time
    */
    function confirmWakeup() public {
        uint256 nextWakeupTime = _nextWakeupTime();
        require((nextWakeupTime - wakeupWindowDuration) < _now(), "Window not open yet");
        require(_now() < nextWakeupTime, "Alarm window missed");
        require(userAlarms[msg.sender].on, "User has no active alarm");
        
        userAlarms[msg.sender].wakeCountArr[_dayOfWeek(_now())] += 1;
    }

    /*
     * Temporarily disable alarm clock. Users cannot be penalized for missed wakeups
     * when their alarm was not set to active.
     */
    function pauseAlarm() public {
        require(userAlarms[msg.sender].on, "Alarm not active");
        require(_deactivationAllowed(msg.sender), "Too close to wakeup time");
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
        userAlarms[msg.sender].activationTime = _nextWakeupTime() - 1 days;
        userAlarms[msg.sender].on = true;
    }

    /**
     * Return the user's staked funds and delete their record from the pool
     */
    function exitAlarmPool() public  {
        require(userAlarms[msg.sender].amountStaked > 0, "User has not joined the pool");
        require(_deactivationAllowed(msg.sender), "Too close to wakeup time");

        // Delete user record prior to transferring to protect again re-entry attacks
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
        uint256 numMissedWakeups = this.missedWakeups(user);
        require(numMissedWakeups > 0, "User has not missed any wakeups");
        uint256 penalty = userAlarms[user].amountStaked * numMissedWakeups * missedWakeupPenalty / 100;
        userAlarms[user].amountStaked -= penalty;
        // Descrease recorded user stake
        // Transfer user penalty funds to an Escrow contract
        rewardDistributor.depositUserPenalty();
    }

    function totalWakeupCount(address user) external view returns (uint totalWakeups) {
        uint8[] memory activeDays = userAlarms[user].activeOnDays;
        totalWakeups = 0;
        for (uint i; i < activeDays.length; i++) {
            totalWakeups += userAlarms[user].wakeCountArr[activeDays[i]];
        }
    }

    /**
     * Determine how many total days have been missed by any given user.
     * @notice missed wakeups if a function of the alarm activation time,
     * the alarm active days, and the last wakeup time:
     * missedWakeups = f(activationTime, alarmDays, lastWakeupTime)
     */
    function missedWakeups(address user) external view returns (uint numMissedWakeups) {
        uint8[] memory userActiveDaysArr = userAlarms[user].activeOnDays;
        uint32[] memory userWakeCountArr = userAlarms[user].wakeCountArr;
        uint256 daysPassed = _daysPassed(userAlarms[user].activationTime, _now());
        uint256 currentDayOfWeek = _dayOfWeek(_nextWakeupTime() - 1 days);
        uint8 activationDay = _dayOfWeek(userAlarms[user].activationTime);
        
        // The expected amount of wakeups for any given alarm day is at least 
        // the amount of weeks elasped.
        uint minWakeups = daysPassed / 7;

        // Iterate over the days (of the week) that the user is scheduled to wakeup on and check
        // how many of those days (of the week) have passed since the activation time. If the user
        // wakeup count is less than the expected wakeup count on that day, missedWakeups is incremented
        numMissedWakeups = 0;
        for (uint i; i < userActiveDaysArr.length; i++) {
            uint8 checkDay = userActiveDaysArr[i];
            uint expectedWakeupsOnThisDay = minWakeups;
            if (activationDay <= checkDay && checkDay <= currentDayOfWeek) {
                expectedWakeupsOnThisDay++;
            }
            numMissedWakeups += expectedWakeupsOnThisDay - userWakeCountArr[checkDay];
        }
    }
    
    function getUserAmountStaked(address user) external view returns(uint) {
        return userAlarms[user].amountStaked;
    }

    /*** Private/Internal Functions ***/

    /**
     * Return the current block time adjusted for the pool's timezone 
     */
    function _now() private view returns (uint256) {
        return uint(int(block.timestamp) + timezoneOffsetSeconds);
    }

    function _nextWakeupTime() private view returns (uint256) {
        return firstWakeupTimestamp + (
        _daysPassed(firstWakeupTimestamp, _now()) * 24 hours); 
    }

    function _daysPassed(uint256 fromTime, uint256 toTime) private view returns (uint256) {
        return (toTime - fromTime) / SECONDS_PER_DAY;
    }

    /**
     * Deactivations are not allowed if the next wakeup day is included in the user's
     * alarm, and the current time is within x hours before the nextwakeup time.
     */
    function _deactivationAllowed(address user) private view returns (bool) {
        return _enforceNextWakeup(user) && (_nextWakeupTime() - _now()) > wakeupWindowDuration;
    }

    function _enforceNextWakeup(address user) private view returns (bool) {
        // Wakeups are not enforced if alarm is turned off
        if (!userAlarms[user].on) return false;
        // If the day of the pool's next wakeup is in user's activeOnDays array, return true
        uint8 nextWakeupDay = _dayOfWeek(_nextWakeupTime());
        for (uint i; i < userAlarms[user].activeOnDays.length; i++) {
            if (userAlarms[user].activeOnDays[i] == nextWakeupDay) {
                return true;
            }
        }
        return false;
    }

    // 1 = Monday, 7 = Sunday
    function _dayOfWeek(uint256 timestamp) internal view returns (uint8 dayOfWeek) {
        uint256 _days = timestamp / SECONDS_PER_DAY;
        dayOfWeek = uint8((_days + 3) % 7 + 1);
    }

    function _validateDaysArr(uint8[] memory daysActive) private pure returns (bool) {
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