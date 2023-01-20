// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../interfaces/IEnforcementModule.sol";
import "../interfaces/IScheduledCommitments.sol";
import "hardhat/console.sol";

/**
 * The Missed Deadline Timelock enforcement module allows DeadlineCommitments to be
 * submitted with a staked amount chosen by the user. This enforcement modues will 
 * lock the users funds for a certain amount of time if the user is not able to submit
 * their confirmation before the deadlie.
 */
contract MissedDeadlineTimelock is IEnforcementModule {
    struct userEntry {
        uint256 stake;
        uint256 unlockTime;
        IScheduledCommitment commitment;
        bool locked;
    }

    mapping(address => userEntry) public userEntries;
    uint entries;

    function join(IScheduledCommitment commitment, bytes calldata joinData) public override payable {
        uint lockDuration = abi.decode(joinData, (uint));
        require(
            commitment.scheduleType() == ScheduleType.DEADLINE,
            "INCOMPATIBLE_COMMIT_TYPE"
        );
        require(
            msg.sender == commitment.owner(),
            "ONLY_OWNER_ACTION"
        );
        require(msg.value > 0, "STAKE_VALUE_NOT_SENT");

        uint256 commitDeadline = IDeadlineCommitment(address(commitment)).deadline();
        userEntries[commitment.owner()] = userEntry({
            stake: msg.value,
            unlockTime: commitDeadline + lockDuration,
            commitment: IScheduledCommitment(commitment),
            locked: false
        });

        entries++;
    }

    function penalize(address user) public override {
        require(userEntries[user].stake > 0, "USER_NOT_STAKED");
        require(
            userEntries[user].commitment.missedDeadlines() > 0, 
            "NOTHING_TO_PENALIZE"
        );

        // If a user stake is locked, the user cannot withdraw until their
        // specified timelock duration has passed
        userEntries[user].locked = true;
    }

    function exit() public override {
        require(userEntries[msg.sender].stake > 0, "USER_NOT_STAKED");

        // Apply penalty (lock) if there are missed deadlines that haven't been penalized
        if (
            !userEntries[msg.sender].locked && 
            userEntries[msg.sender].commitment.missedDeadlines() > 0
        ) {
            penalize(msg.sender);
        }

        // Prevent withdraw during the commitment's submission window
        require( 
            !userEntries[msg.sender].commitment.inSubmissionWindow(), 
            "CANT_WITHDRAW_IN_SUBMISSION_WINDOW"
        );

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
