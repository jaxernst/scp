pragma solidity ^0.8.0;

import './RewardDistributor.sol';

interface ISocialAlarmClock {
    struct UserAlarm {
        bool on;
        uint amountStaked;
        uint8[] activeOnDays; // 1 = Monday -> 7 = Sunday
        uint64[] wakeCount; // Array of length 7 to count wakeups for each day of the week
        uint activationTime; // The time the user's alarm became active (rounded to last wakeup)
    }

    function joinAlarmPool() external payable;
    function exitAlarmPool() external;
    function confirmWakeup() external;
    function pauseAlarm() external;
    function resumeAlarm() external;
    function penalize() external;
}


contract AlarmClockPool is ISocialAlarmClock {
    uint32 SECONDS_PER_DAY = 86400; // hardcode for gas saving
   
    /**
     * Alarm pools are timezone specific, so the pool will interpret the current time
     * as the block's timestamp (UTC time) offset by 'timezoneOffset' seconds. (+/- 12 hours)
     * @notice seconds are used to match timestamp format, which reduces computations needed
     * to calculate timezone addjust time.
     */
    int8  public timezoneOffsetSeconds;

    /** 
     * Timezone adjusted starting wakeup time.
     * Determines the pool wakeup time
     */
    uint public firstWakeupTimestamp; // Timezone adjusted starting wakeup time 
    
    uint wakeupWindowDuration  = 1 hours; // Before wake time
    uint8 public missedWakeupPenalty; // penalty taken for each missed wakeup (%)
    uint8 public poolEntryFee = 1; // pool fee (%)

    address public factory;
    IAlarmPoolRewardDistributor rewardDistributor;

    mapping(address => UserAlarm) userAlarms;

    constructor(
        int8 _timezoneOffsetHours, 
        uint _firstWakeupTime, 
        uint8 _missedWakeupPenalty
    ) {
        require(
            -12 <= _timezoneOffsetHours && _timezoneOffsetHours <= 12, 
            "Time offset out of range"
        );
        timezoneOffsetSeconds = _timezoneOffsetHours * 60 * 60;
        factory = msg.sender;
        missedWakeupPenalty = _missedWakeupPenalty;
    }

    /*** Public functions ***/

    function joinAlarmPool(uint8[] memory _activeOnDays) public payable {
        require(_validateDaysArr(_activeOnDays), "activeOnDays array invalid");
        require(msg.value > 0, "Must send value to stake when joining pool");
        require(!userAlarms[msg.sender].on, "User alarm already active");
        
        uint fee = msg.value * poolEntryFee;
        userAlarms[msg.sender] = UserAlarm({
            on: true,
            amountStaked: msg.value - fee,
            activeOnDays: _activeOnDays,
            wakeCount: new uint64[](7),
            activationTime: _nextWakeupTime() - 1 days// Round to prev. wakeup timestamp
        });

        payable(factory).transfer(fee);
    }

    /**
     * Submit a wakeup confirmation within the wakeup window.
     * @notice A wakeup cannot be confirmed if the transaction gets executed after the wakeup time
    */
    function confirmWakeup() public {
        uint nextWakeupTime = _nextWakeupTime();
        require((nextWakeupTime - wakeupWindowDuration) < _now(), "Window not open yet");
        require(_now() < nextWakeupTime, "Alarm window missed");
        require(userAlarms[msg.sender].on, "User has no active alarm");
        
        userAlarms[msg.sender].wakeCount[_dayOfWeek(_now())] += 1;
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
        userAlarms[msg.sender].wakeCount = new uint64[](7);
        userAlarms[msg.sender].activationTime = _nextWakeupTime() - 1 days;
        userAlarms[msg.sender].on = true;
    }

    /**
     * Return the user's staked funds and delete their record from the pool
     */
    function exitAlarmPool() public  {
        require(userAlarms[msg.sender].amountStaked > 0, "User has not joined the pool");
        require(_deactivationAllowed(msg.sender), "Too close to wakeup time");
        uint returnAmount = userAlarms[msg.sender].amountStaked;
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
        uint numMissedWakeups = missedWakeups(user);
        require(missedWakeups > 0, "User has not missed any wakeups");
        uint penalty = userAlarms[user].amountStaked * numMissedWakeups / missedWakeupPenalty;
        userAlarms[user].amountStaked -= penalty;
        // Descrease recorded user stake
        // Transfer user penalty funds to an Escrow contract
        rewardDistributor.deposit(penalty);
    }

    /**
     * Determine how many total days have been missed by any given user.
     * @notice missed wakeups if a function of the alarm activation time,
     * the alarm active days, and the last wakeup time:
     * missedWakeups = f(activationTime, alarmDays, lastWakeupTime)
     */
    function missedWakeups(address user) public view returns (uint32 numMissedWakeups) {
        uint8[] memory userActiveDaysArr = userAlarms[user].activeOnDays;
        uint64[] memory userWakeCountArr = userAlarms[user].wakeCount;
        uint daysPassed = _daysPassed(userAlarms[user].activationTime);
        uint currentDayOfWeek = _dayOfWeek(_nextWakeupTime() - 1 days);
        uint8 activationDay = _dayOfWeek(userAlarms[user].activationTime);
        
        // The expected amount of wakeups for any given alarm day is at least 
        // the amount of weeks elasped.
        uint32 minWakeups = daysPassed / 7;

        // Iterate over the days (of the week) that the user is scheduled to wakeup on and check
        // how many of those days (of the week) have passed since the activation time. If the user
        // wakeup count is less than the expected wakeup count on that day, missedWakeups is incremented
        numMissedWakeups = 0;
        for (uint i; i < userActiveDaysArr.length; i++) {
            uint8 checkDay = userActiveDaysArr[i];
            uint expectedWakeupsOnThisDay = minWakeups;
            if (activationDay <= checkDay <= currentDayOfWeek) {
                expectedWakeupsOnThisDay++;
            }
            numMissedWakeups += expectedWakeupsOnThisDay - userWakeCountArr[checkDay];
        }
    }

    /*** Private/Internal Functions ***/

    /**
     * Return the current block time adjusted for the pool's timezone 
     */
    function _now() private view returns (uint) {
        return now + timezoneOffsetSeconds * 60 * 60;
    }

    function _nextWakeupTime() private view returns (uint256) {
        return firstWakeupTimestamp + (_daysPassed() * 24 hours); 
    }

    function _daysPassed(uint fromTime, uint toTime) private view returns (uint256) {
        return (toTime - fromTime) / (24 * 60 * 60);
    }

    /**
     * Deactivations are not allowed if the next wakeup day is included in the user's
     * alarm, and the current time is within x hours before the nextwakeup time.
     */
    function _deactivationAllowed(address user) private returns (bool) {
        return _enforceNextWakeup(user) && (_nextWakeupTime() - _now()) > wakeupWindowDuration;
    }

    function _enforceNextWakeup(address user) private view returns (bool) {
        uint8 nextWakeupDayOfWeek = _dayOfWeek(_nextWakeupTime());
        return false; // Todo
    }

    // 1 = Monday, 7 = Sunday
    function _dayOfWeek(uint timestamp) internal pure returns (uint8 dayOfWeek) {
        uint _days = timestamp / SECONDS_PER_DAY;
        dayOfWeek = uint8((_days + 3) % 7 + 1);
    }

    function _validateDaysArr(uint8[] memory daysActive) private pure returns (bool) {
        if (daysActive.length > 7 || daysActive.length == 0) {
            return false;
        }
        for (uint i; i < daysActive.length; i++) {
            continue;
        }
    }
}