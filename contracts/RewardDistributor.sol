pragma solidity ^0.8.0;

import "./AlarmPool.sol";

interface IAlarmPoolRewardDistributor {
    function claim(address) external;
    function depositUserPenalty() external payable;
}

contract AlarmPoolRewardDistributor is IAlarmPoolRewardDistributor {
    mapping(address => uint256) userAmountsClaimed;
    uint256 requiredWakeupsToClaim = 0;
    IAlarmPool alarmPool;

    constructor() {
        alarmPool = IAlarmPool(msg.sender);
    }

    // ToDo: Improve accounting and reward logic so users cannot be entitled to claim
    // their own penalties
    function depositUserPenalty() external override payable {}

    /**
     * Users are entitled to rewards proportional to the amount they
     * have staked.
     */
    function claim(address user) external override {
        require(
            alarmPool.totalWakeupCount(user) >= requiredWakeupsToClaim,
            "Wakeup minimum not met"
        );

        uint256 userStake = alarmPool.getUserAmountStaked(user);
        uint256 totalEntitlement = (userStake * address(this).balance) /
            (address(alarmPool).balance + address(this).balance);
        uint256 claimable = totalEntitlement - userAmountsClaimed[user];

        // Update userAmountsClaimed before transferring to protect against reentry
        userAmountsClaimed[user] += claimable;
        payable(user).transfer(claimable);
    }
}
