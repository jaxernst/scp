// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { BaseCommitment } from "../../BaseCommitment.sol";
import { IDeadlineSchedule } from "../../interfaces/IScheduledCommitments.sol";
import "../../types.sol";

import "hardhat/console.sol";

contract DeadlineCommitment is IDeadlineSchedule, BaseCommitment {
    ScheduleType public constant scheduleType = ScheduleType.DEADLINE;

    uint256 public deadline;
    uint256 public submissionWindow;

    function init(bytes calldata data) public virtual override initializer {
        string memory commitmentDescription;
        (
            deadline,
            submissionWindow,
            name,
            commitmentDescription
        ) = abi.decode(data, (uint256, uint256, string, string));
        require(block.timestamp < deadline, "DEADLINE_PASSED");
        emit CommitmentCreated(commitmentDescription);
    }

    function submitConfirmation() public virtual override onlyOwner {
        require(inSubmissionWindow(), "NOT_IN_SUBMISSION_WINDOW");
        emit ConfirmationSubmitted();
        status = Status.COMPLETE;
    }

    function submitConfirmationWithProof(string memory proofUri)
        public
        virtual
        override
        onlyOwner
    {
        require(inSubmissionWindow(), "NOT_IN_SUBMISSION_WINDOW");
        emit ProofSubmitted(proofUri, ++nextProofId);
        status = Status.COMPLETE;
    }

    function missedDeadlines() public view override returns (uint256) {
        // Deadline commitments can only be marked complete if a confirmation
        // was submitted within the window
        if (block.timestamp < deadline || status == Status.COMPLETE) {
            return 0;
        }
        return 1;
    }

    function inSubmissionWindow() public view override returns(bool) {
        return
            block.timestamp <= deadline &&
            deadline - submissionWindow < block.timestamp;
    }

    function nextDeadline() public view override returns(uint) {
        return deadline;
    }
}
