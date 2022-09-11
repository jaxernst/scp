pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISocialAlarmClock {
    struct UserAlarm {
        bool on;
        uint amountStaked;
        uint8[] daysActive;
        uint wakeCount;
        uint joinTime;
    }
}

contract AlarmClockPool is ISocialAlarmClock {
    uint firstWakeupTimestamp; 
    uint missedWakeupPenalty // basis points
    uint poolEntryFee // basis points
    uint wakeupWindow = 1 hours; // Before wake time

    mapping(address => UserAlarm) userAlarms;

    constructor(
        uint timezoneOffset, 
        uint _firstWakeupTime, 
        uint _missedWakeupPenalty, 
        uint _entryFee) {
        factory = msg.sender;
        missedWakeupPenalty = _missedWakeupPenalty;
        poolEntryFee = _entryFee;
    }

    function joinAlarmPool(uint8[] _daysActive) public payable {
        _validateDays(_daysActive);

        require(msg.value > 0, "Must send value to stake when joining pool");
        require(!userAlarms[msg.sender].active, "User alarm already active");
        
        uint fee = _bpsPercent(msg.value, poolEntryFee);
        userAlarms[msg.sender] = UserAlarm({
            active: true,
            amountStaked: msg.value - fee,
            daysActive: _daysActive
            wakeCount: 0,
            joinTime: _nextWakeupTime() // Round to next wakeup timestamp
        });

        factory.transfer(fee);
    }

    function pauseAlarm() public {
        require(_deactivationAllowed(msg.sender), "Too close to wakeup time")

    }

    /**
     * Return the users staked funds and delete their record from the pool
     */
    function exitAlarmPool() public  {
        require(_deactivationAllowed(msg.sender), "Too close to wakeup time");
        require(userAlarms[msg.sender].active, "User has not joined the pool");
        uint returnAmount = userAlarms[msg.sender].amountStaked;
        // Delete user record prior to transferring to protect again re-entry attacks
        delete userAlarms[msg.sender];
        payable(msg.sender).transfer(userAlarms[msg.sender].amountStaked);
    }

    function confirmWakeup() public {
        uint nextWakeupTime = _nextWakeupTime();
        require((nextWakeupTime - alarmWindowOpen) < block.timestamp, "Window not open yet");
        require(block.timestamp < nextWakeupTime, "Alarm window missed");
        require(userAlarms[msg.sender], "User has no active alarm");
        userAlarms[msg.sender].numWakeups += 1;
    }

    /**
     * Off-chain software tracks active users and monitors for missed wake-ups. Identifying
     * users that have missed their wake-ups is expensive, and thus this identification process
     * occurs off chain, when a missed wake-up is identified, on data timestamp storage can
     * either confirm or deny the legitimacy of this penalty claim
     */
    function penalize(address user) public {
        uint missedWakeups = _missedWakeup();
        require(missedWakeups > 0, "User has not missed any wakeups");
        userAlarms[user] -= _computePenalty(user, missedWakeups);
        // Descrease recorded user stake
        // Transfer user penalty funds to an Escrow contract
        
    }

    function _missedWakeups(address user) private returns (bool) {
        // (days since user joined) - (wake count) = missed wakeups
        return _daysPassed(userAlarms[user].joinTime) - userAlarms[user].wakeCount;
    }

    function _bpsPercent(uint fromAmount, uint8 bps) private returns (uint) {
        return fromAmount * bps / 10000; // ToDo: Integar math to calculate fees
    }

    function _nextWakeupTime() private view returns (uint256) {
        return firstWakeTime + (_daysPassed * 24 hours); 
    }

    /**
     * This is wrong
     */
    function _daysPassed(startTime) private view returns (uint256) {
        return ((now - firstWakeTime) / 24);
    }


    function _computePenalty(user, missedWakeups) private returns (uint) {
        return userAlarms[user];
    }

    /**
     * Deactivations are not allowed if the next wakeup day is included in the user's
     * alarm, and the current time is within x hours before the nextwakeup time.
     */
    function _deactivationAllowed(address user) private returns (bool) {
        return _enforceNextWakeup(user) && (_nextWakeupTime() - now) > wakeupWindow;
    }

    function _enforceNextWakeup(address user) private view returns (bool) {
        nextWakeupDayOfWeek = _dayOfWeek(_nextWakeupTime())
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