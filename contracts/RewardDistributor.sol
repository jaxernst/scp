pragma solidity ^0.8.0;

import './AlarmPool.sol';

interface IAlarmPoolRewardDistributor {
    function depositUserPenalty() external payable;
    function claim() external;
}

contract AlarmPoolRewardDistributor is IAlarmPoolRewardDistributor {    
    uint rewardFundSize;
    uint requiredWakeupsToClaim = 30;

    IAlarmPool alarmPool;
    mapping(address => uint) userAmountsClaimed;

    constructor() {
        alarmPool = IAlarmPool(msg.sender);
    }

    // ToDo: Imporve accounting and reward logic so users cannot be entitled to claim
    // their own penalties
    function depositUserPenalty() external payable {   
        rewardFundSize += msg.value;
    }

    /**
     * Users are entitled to rewards based proportional to the amount they
     * have staked.
     */
    function claim() external {
        require(
            alarmPool.totalWakeupCount(msg.sender) >= requiredWakeupsToClaim,
            "Wakeup minimum not met"    
        );

        uint userStake = alarmPool.getUserAmountStaked(msg.sender);
        uint totalEntitlement = (userStake * rewardFundSize) / address(alarmPool).balance;
        uint totalClaimable = totalEntitlement - userAmountsClaimed[msg.sender];

        // Update userAmountsClaimed before transferring to protect against reentry
        userAmountsClaimed[msg.sender] -= totalClaimable;
        payable(msg.sender).transfer(totalClaimable);
    }

}