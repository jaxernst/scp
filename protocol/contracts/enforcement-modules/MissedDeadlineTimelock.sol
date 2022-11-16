// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../EnforcementModule.sol";
import "../commitment-types/DeadlineCommitment.sol";

contract MissedDeadlineTimelock is EnforcementModule {
    struct userEntry {
        uint256 stake;
        uint256 unlockTime;
        Commitment commitment;
        bool locked;
    }

    mapping(address => userEntry) userEntries;

    function join(Commitment commitment, uint lockDuration) public payable {
        require(
            commitment.scheduleType() == ScheduleType.DEADLINE,
            "INCOMPATIBLE_COMMIT_TYPE"
        );
        require(
            msg.sender == commitment.owner(),
            "ONLY_OWNER_ACTION"
        );
        require(msg.value > 0, "STAKE_VALUE_NOT_SENT");

        uint256 commitDeadline = DeadlineCommitment(address(commitment)).deadline();
        userEntries[commitment.owner()] = userEntry({
            stake: msg.value,
            unlockTime: commitDeadline + lockDuration,
            commitment: commitment,
            locked: false
        });

        entries++;
    }

    function penalize(Commitment commitment) public {
        address owner = commitment.owner();
        require(userEntries[owner].stake > 0, "USER_NOT_STAKED");
        require(
            commitment.missedDeadlines() > 0, 
            "NOTHING_TO_PENALIZE"
        );

        // If a user stake is locked, the user cannot withdraw until their
        // specified timelock duration has passed
        userEntries[owner].locked = true;
    }

    function exit() public {
        require(userEntries[msg.sender].stake > 0, "USER_NOT_STAKED");
        // Apply penalty (lock) if there are missed deadlines that haven't been penalized
        if (
            !userEntries[msg.sender].locked && 
            userEntries[msg.sender].commitment.missedDeadlines() > 0
        ) {
            penalize(userEntries[msg.sender].commitment);
        }

        if (
            userEntries[msg.sender].locked &&
            block.timestamp < userEntries[msg.sender].unlockTime
        ) {
            revert("USER_FUNDS_LOCKED");
        }

        userEntries[msg.sender].stake = 0;
        payable(msg.sender).transfer(userEntries[msg.sender].stake);
        delete userEntries[msg.sender];
    }
}
