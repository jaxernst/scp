// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../interfaces/IEnforcementModule.sol";
import "../interfaces/IScheduledCommitments.sol";
import "../commitment-types/scheduled/DeadlineCommitment.sol";
import "hardhat/console.sol";

/**
 * Track deposits and allow funds to be locked for specified duration of time after 
 * a penalty is applied.
 * 
 * ToDo: Consider the implications of having a library tracking deposits when the 
 * target contract still has ultimate control over the funds. As a standalone library,
 * is it safe to assume the target contract will maintain those funds, or should the 
 * transfer to an external vault?
 */
library TimelockPenalty {
    struct Timelock {
        uint lockDuration;
        uint depositValue;
        uint unlockTime;
    }

    
    function init(Timelock storage self, uint depositValue, uint lockDuration) internal {
        require(msg.value >= depositValue, "INSUFFICIENT_VALUE_SENT");
        self.depositValue = depositValue;
        self.lockDuration = lockDuration;
        self.unlockTime = 0;
    }

    /**
     * @notice Penalities can be applied more than once. Calling the penalize function
     * with a lock already established will extend the lock time be lockDuration
     */
    function penalize(Timelock storage self) internal {
        require(self.depositValue > 0, "NO_DEPOSIT");
        self.unlockTime = block.timestamp + self.lockDuration;
    }

    function withdraw(Timelock storage self, address payable to) internal {
        // Block timestmap will always be greeater than unlockTime unless 
        // the penalize function was called and the lock duration has not elasped
        require(block.timestamp > self.unlockTime, "FUNDS_LOCKED");
        uint transferVal = self.depositValue;
        self.depositValue = 0;
        to.transfer(transferVal);
    }
}