pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISocialAlarmClock {
    struct UserAlarm {
        bool active;
        uint amountStaked;
        uint wakeCount;
        uint joinTime;
    }
}

contract SocialAlarmClock is ISocialAlarmClock {
  
    uint wakeTimestamp; 
    uint maxPoolMembers = 30;
    uint stakePenalty = 10000; // basis points
    uint poolEntryFee = 1000; // .1%

    uint alarmWindowOpen = 1 hours; // Before wake time

    mapping(address => Alarms) userAlarms;

    address admin;

    constructor(address _admin) {
        admin = _admin;
    }

    function joinAlarmPool() public payable {
        require(msg.value > 0, "Must send value to stake when joining pool");
        require(!userAlarms[msg.sender].active, "User alarm already active");
        uint fee = _bpsPercent(msg.value, poolEntryFee);
        userAlarms[msg.sender] = UserAlarm({
            active: true,
            amountStaked: msg.value - fee,
            wakeCount: 0,
            joinTime: _nextWakeupTime() // Round to next wakeup timestamp
        });

        admin.transfer(fee);
    }

    /**
     * Return the users staked funds and delete their record from the pool
     */
    function exitAlarmPool() public  {
        require(_deactivationAllowed(), "Too close to wakeup time to exit pool");
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
     * Deactivations are not allowed if the current time is within x hours before 
     * the wakeup time
     */
    function _deactivationAllowed() private returns (bool) {
        // Will figure out this math later
        return (_nextWakeupTime() - now) > alarmWindowOpen;
    }

}