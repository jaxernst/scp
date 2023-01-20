// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../Commitment.sol";
import "../penalty-modules/TimelockPenalty.sol";
import "../schedule-modules/DeadlineSchedule.sol";

contract TimelockingDeadlineTask is Commitment {
    string constant IMPLEMENTATION_NAME = "Timelocking Deadline Task";
    ScheduleType public constant scheduleType = ScheduleType.DEADLINE;

    //** SCP Modules **//
    using DeadlineSchedule for DeadlineSchedule.Schedule;
    using TimelockPenalty for TimelockPenalty.Timelock;
    DeadlineSchedule.Schedule schedule;
    TimelockPenalty.Timelock penalizer;

    function init(bytes calldata data)
        public
        payable
        virtual
        override
        initializer
    {
        uint deadline;
        uint submissionWindow;
        uint timelockDuration;
        string memory taskDescription;
        (deadline, submissionWindow, timelockDuration, taskDescription) = abi.decode(
            data, 
            (uint, uint, uint, string)
        );

        name = IMPLEMENTATION_NAME;
        schedule.init(deadline, submissionWindow);
        penalizer.init(msg.value, timelockDuration);

        emit CommitmentCreated(taskDescription);
    }
    
    /**
     * Confirm completion and mark the commitment as complete
     * @notice This commitment will allow confirmations to be submitted after the
     * deadline, but funds will be locked so no automatic withdrawl will take place
     */
    function submitConfirmation() public virtual override onlyOwner {
        require(status == CommitmentStatus.ACTIVE, "NOT_ACTIVE");
        if (block.timestamp > schedule.deadline) {
            // Deadline was missed, so apply penalty, mark complete then return
            _penalizeIfApplicable();
            _markComplete();
            return;
        }
        
        // Will revert if not yet in submission window
        schedule.recordEntry();
        _markComplete();
        withdraw();
    }

    function submitConfirmationWithProof(string memory proofUri)
        public
        virtual
        override
        onlyOwner
    {
        emit ProofSubmitted(proofUri, ++nextProofId);
        submitConfirmation();
    }

    /**
     * Deactivate commitment and withdrawl funds.
     * @notice The commitment cannot be canceled if the the timestamp is within
     * the submission window or if the timelock penalty is active
     */
    function cancel() public onlyOwner {
        emit StatusChanged(status, CommitmentStatus.CANCELLED);
        status = CommitmentStatus.CANCELLED;
        withdraw();
    }

    function withdraw() public onlyOwner {
        require(!schedule.inSubmissionWindow(), "CANT_WITHDRAW_IN_SUBMISSION_WINDOW");
        _penalizeIfApplicable();
        penalizer.withdraw(payable(owner));
    }

    function _markComplete() private {
        emit StatusChanged(status, CommitmentStatus.COMPLETE);
        status = CommitmentStatus.COMPLETE;
    }

    function _penalizeIfApplicable() private {
        if (schedule.missedDeadlines() > 0) {
            penalizer.penalize();
        }
    }

}
