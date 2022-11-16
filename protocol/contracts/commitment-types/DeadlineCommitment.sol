// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { Commitment } from "../Commitment.sol";
import { DeadlineScheduledCommitment } from "../schedule-modules/DeadlineSchedule.sol";
import "../schedule-modules/ScheduleTypes.sol";

contract DeadlineCommitment is DeadlineScheduledCommitment {
   event ToDoCommitmentCreated(uint deadline);

   function _decodeInitData(bytes calldata initData) internal override {
      (deadline, submissionWindow) = abi.decode(initData, (uint, uint));
      require(block.timestamp < deadline, "DEADLINE_PASSED");
      __init_deadline_schedule(deadline, submissionWindow);

      emit ToDoCommitmentCreated(deadline);
   }

   function submitConfirmation() public override onlyOwner {
      require(_inSubmissionWindow(), "NOT_IN_SUBMISSION_WINDOW");
      emit ConfirmationSubmitted();
      _setDeadlineMet();
      _markComplete();
   }
} 