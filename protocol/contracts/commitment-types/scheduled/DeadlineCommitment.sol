// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { BaseCommitment } from "../../Commitment.sol";
import "../../interfaces/IDeadlineCommitment.sol";
import "../../ScheduleTypes.sol";

contract DeadlineCommitment is BaseCommitment {
    ScheduleType public override scheduleType = ScheduleType.DEADLINE;

    uint public deadline;
    uint public submissionWindow;
    bool public deadlineMet = false;

    function __init__DeadlineCommitment(bytes memory _data) public initializer returns(bool) {
        bytes memory data;
        (deadline, submissionWindow, data) = abi.decode(
            _data,
            (uint, uint, bytes)
        );
        return __init__BaseCommitment(data);
    }

    function submitConfirmation() public virtual override onlyOwner {
        require(_inSubmissionWindow(), "NOT_IN_SUBMISSION_WINDOW");
        emit ConfirmationSubmitted();
        status = Status.Complete;
    }

    function submitConfirmationWithProof(string memory proofUri)
        public
        virtual
        override
        onlyOwner
    {
        require(_inSubmissionWindow(), "NOT_IN_SUBMISSION_WINDOW");
        emit ProofSubmitted(proofUri, ++nextProofId);
        status = Status.Complete;
    }

    function missedDeadlines() public view override returns (uint) {
        // Deadline commitments can only be marked complete if a confirmation
        // was submitted within the window
        if (block.timestamp < deadline || deadlineMet) {
            return 0;
        }
        return 1;
    }

    function _inSubmissionWindow() internal view returns (bool) {
        return
            block.timestamp <= deadline &&
            deadline - submissionWindow < block.timestamp;
    }
} 