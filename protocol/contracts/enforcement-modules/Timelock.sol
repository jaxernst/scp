// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../EnforcementModule.sol";
import "../commitment-types/DeadlineCommitment.sol";

contract DeadlineTimelock is EnforcementModule {
    struct userEntry {
        uint stake;
        uint unlockTime;
        DeadlineCommitment commitContract;
        bool locked;
    }

    mapping(address => userEntry) userEntries;

    function join(address commitment, uint timelockDuration) public payable {
        uint commitDeadline = DeadlineCommitment(commitment).deadline();
        require(block.timestamp < commitDeadline, "DEADLINE_PASSED");
        require(msg.sender == DeadlineCommitment(commitment).owner(), "ONLY_OWNER_ACTION");
        require(msg.value > 0, "STAKE_VALUE_NOT_SENT");

        userEntries[commitment.owner()] = userEntry({
            stake: msg.value,
            unlockTime: commitDeadline + timelockDuration,
            commitContract: commitment,
            locked: false
        });

        entries++;
    }

    function penalize(DeadlineCommitment commitment) public {
        address owner = commitment.owner();
        require(userEntries[owner].stake > 0, "USER_NOT_STAKED");
        
        uint missedDeadlines = commitment.missedDeadlines();
        require(missedDeadlines > 0, "NOTHING_TO_PENALIZE");

        // If a user stake is locked, the user cannot withdraw until their
        // specified timelock duration has passed
        userEntries[owner].locked = true;
    }

    function withdraw() public {
        require(userEntries[msg.sender].stake > 0, "USER_NOT_STAKED");
        if (userEntries[msg.sender].locked && 
            block.timestamp < userEntries[msg.sender].unlockTime
        ) {
            revert("USER_FUNDS_LOCKED");
        }

        userEntries[msg.sender].stake = 0;
        payable(msg.sender).transfer(userEntries[msg.sender].stake);
        delete userEntries[msg.sender];
    }
}