pragma solidity ^0.8.0;

interface ISocialAlarmClock {

    struct UserAlarm {
        bool on;
        uint amountStaked;
        uint8[] activeOnDays; // 1 = Monday -> 7 = Sunday
        uint[] wakeCount; // Array of length 7 to count wakeups for each day of the week
        uint activationTime; // The time the user's alarm became active (rounded to last wakeup)
    }
}

contract AlarmClockPool is ISocialAlarmClock {
    /**
     * Alarm pools are timezone specific, so the pool will interpret the current time
     * as the block's timestamp (UTC time) offset by 'timezoneOffset' hours. (+/- 12 hours)
     */
    int8  public timezoneOffsetHours;

    /** 
     * Timezone adjusted starting wakeup time.
     * Determines the pool wakeup time
     */
    uint firstWakeupTimestamp; // Timezone adjusted starting wakeup time 
    
    uint missedWakeupPenalty; // basis point fee taken for each missed wakeup
    uint poolEntryFee; // basis points pool fee
    uint wakeupWindowDuration  = 1 hours; // Before wake time

    mapping(address => UserAlarm) userAlarms;

    constructor(
        int8 timezoneOffsetHours, 
        uint _firstWakeupTime, 
        uint _missedWakeupPenalty, 
        uint _entryFee
    ) {
        require(-12 <= timezoneOffsetHours <= 12, "Time offset out of range");
        
        factory = msg.sender;
        missedWakeupPenalty = _missedWakeupPenalty;
        poolEntryFee = _entryFee;
    }

    /*** Public functions ***/

    function joinAlarmPool(uint8[] _activeOnDays) public payable {
        require(_validateDays(_activeOnDays), "activeOnDays array invalid");
        require(msg.value > 0, "Must send value to stake when joining pool");
        require(!userAlarms[msg.sender].active, "User alarm already active");
        
        uint fee = _bpsPercent(msg.value, poolEntryFee);
        userAlarms[msg.sender] = UserAlarm({
            active: true,
            amountStaked: msg.value - fee,
            activeOnDays: _daysActive,
            wakeCount: new uint64[](7),
            activationTime: _nextWakeupTime() - 1 days// Round to prev. wakeup timestamp
        });

        factory.transfer(fee);
    }

    function pauseAlarm() public {
        require(userAlarms[msg.sender].active, "Alarm not active");
        require(_deactivationAllowed(msg.sender), "Too close to wakeup time");
        userAlarms[msg.sender].active = false;
    }

    function resumeAlarm() public {
        require(!userAlarms[msg.sender].active, "Alarm already active");
        // Reset alarm vars used to track missed wakeups/penalties
        userAlarms[msg.sender].wakeCount = 0;
        userAlarms[msg.sender].activationTime = _nextWakeupTime() - 1 days;
        userAlarms[msg.sender].active = true;
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

    function confirmWakeup() public {
        uint nextWakeupTime = _nextWakeupTime();
        require((nextWakeupTime - wakeupDuration) < _now(), "Window not open yet");
        require(_now() < nextWakeupTime, "Alarm window missed");
        require(userAlarms[msg.sender], "User has no active alarm");
        
        userAlarms[msg.sender].wakeups[_dayOfWeek()] += 1;
    }

    /**
     * Off-chain software tracks active users and monitors for missed wake-ups. Identifying
     * users that have missed their wake-ups is expensive, and thus this identification process
     * occurs off chain, when a missed wake-up is identified, on data timestamp storage can
     * either confirm or deny the legitimacy of this penalty claim
     */
    function penalize(address user) public {
        uint missedWakeups = _missedWakeups(msg.sender);
        require(missedWakeups > 0, "User has not missed any wakeups");
        userAlarms[user] -= _computePenalty(user, missedWakeups);
        // Descrease recorded user stake
        // Transfer user penalty funds to an Escrow contract
        
    }

    /**
     * Determine how many total days have been missed by any given user
     */
    function missedWakeups(address user) public view returns (uint) {
        uint8[] userActiveDaysArr = userAlarms[user].activeOnDays;
        uint[] userWakeCountArr = userAlarms[user].wakeCount;
        uint daysPassed = _daysPassed(userAlarms[user].activationTime);
        uint currentDayOfWeek = dayOfWeek(_nextWakeupTime() - 1 days);
        
        // The expected amount of wakeups for any given alarm day is at least 
        // the amount of weeks elasped
        uint minWakeups = daysPassed / 7;

        // Iterate over the days (of the week) that the user is scheduled to wakeup on and check
        // how many of those days (of the week) have passed since the activation time. If the user
        // wakeup count is less than the expected wakeup count on that day, missedWakeups is incremented
        uint missedWakeups = 0;
        for (uint i; i < userActiveDaysArr.length; i++) {
            uint checkDay = userActiveDaysArr[i];
            uint expectedWakeupsOnThisDay = minWakeups;
            if (activationDay <= checkDay <= currentDayOfWeek) {
                expectedWakeupsOnThisDay++;
            }
            missedWakeups += expectedWakeupsOnThisDay - userWakeCount[checkDay];
        }
        return _daysPassed(userAlarms[user].activationTime) - userAlarms[user].wakeCount;
    }

    /*** Private/Internal Functions ***/

    /**
     * Return the current block time adjusted for the pool's timezone 
     */
    function _now() private view returns (uint) {
        return now + timezoneOffset * 60 * 60;
    }

    function _nextWakeupTime() private view returns (uint256) {
        return firstWakeTime + (_daysPassed() * 24 hours); 
    }

    function _bpsPercent(uint fromAmount, uint8 bps) private returns (uint) {
        return fromAmount * bps / 10000; // ToDo: Integar math to calculate fees
    }

    function _daysPassed(startTime) private view returns (uint256) {
        return (_now() - firstWakeTime) / (24 * 60 * 60);
    }

    /**
     * Deactivations are not allowed if the next wakeup day is included in the user's
     * alarm, and the current time is within x hours before the nextwakeup time.
     */
    function _deactivationAllowed(address user) private returns (bool) {
        return _enforceNextWakeup(user) && (_nextWakeupTime() - _now()) > wakeupWindowDuration;
    }

    function _enforceNextWakeup(address user) private view returns (bool) {
        nextWakeupDayOfWeek = _dayOfWeek(_nextWakeupTime());
    }

    // 1 = Monday, 7 = Sunday
    function _dayOfWeek(uint timestamp) internal pure returns (uint dayOfWeek) {
        uint _days = timestamp / SECONDS_PER_DAY;
        dayOfWeek = (_days + 3) % 7 + 1;
    }

    function _activeDaysArrayValid(uint8[] daysActive) private pure returns (bool) {
        if (daysActive.length > 7 || daysActive.length == 0) return false
        for (uint i; i < daysActive.length; i++) {

        }
    }
}