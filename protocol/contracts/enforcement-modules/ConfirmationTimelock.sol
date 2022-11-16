// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../EnforcementModule.sol";
import "../commitment-types/DeadlineCommitment.sol";

contract DeadlineConfirmationTimelock is EnforcementModule {
    struct userEntry {
        uint256 stake;
        uint256 unlockTime;
        DeadlineCommitment commitment;
        bool locked;
    }

    mapping(address => userEntry) userEntries;

    function join(address commitment, bytes memory joinData) public payable override {
        uint lockDuration = abi.decode(joinData, (uint));
        _join(DeadlineCommitment(commitment), lockDuration, 0);
    }

    function _join(
        IDeadlineTimer commitment, 
        uint256 lockDuration, 
        uint minAttestations
    ) private {
        uint256 commitDeadline = DeadlineCommitment(commitment).deadline();
        require(
            msg.sender == DeadlineCommitment(commitment).owner(),
            "ONLY_OWNER_ACTION"
        );
        require(msg.value > 0, "STAKE_VALUE_NOT_SENT");

        userEntries[commitment.owner()] = userEntry({
            stake: msg.value,
            unlockTime: commitDeadline + lockDuration,
            commitment: commitment,
            locked: false
        });

        entries++;
    }

    function penalize(address commitment) public override {
        address owner = DeadlineCommitment(commitment).owner();
        require(userEntries[owner].stake > 0, "USER_NOT_STAKED");

        uint256 missedDeadlines = DeadlineCommitment(commitment).missedDeadlines();
        require(missedDeadlines > 0, "NOTHING_TO_PENALIZE");

        // If a user stake is locked, the user cannot withdraw until their
        // specified timelock duration has passed
        userEntries[owner].locked = true;
    }

    function exit() public override {
        require(userEntries[msg.sender].stake > 0, "USER_NOT_STAKED");
        // Check is commitment has missed penalties
        if (userEntries[msg.sender].commitment.missedDeadlines() > 0) {
            penalize(address(userEntries[msg.sender].commitment));
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
