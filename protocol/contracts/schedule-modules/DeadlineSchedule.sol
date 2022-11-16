// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { Commitment } from "../Commitment.sol";
import "../interfaces/IDeadlineCommitment.sol";

abstract contract DeadlineSchedule {
   uint public deadline;
   uint public submissionWindow;
   bool public deadlineMet = false;

   function __init_deadline_schedule(uint _deadline, uint _submissionWindow) internal {
      require(block.timestamp < deadline, "DEADLINE_PASSED");
      deadline = _deadline;
      submissionWindow = _submissionWindow;
   }

   function setDeadlineMet() internal {
      deadlineMet = true;
   }

   function inSubmissionWindow() public view returns(bool) {
      return 
         block.timestamp <= deadline &&
         deadline - submissionWindow < block.timestamp;
   }

   function missedDeadlines() public view returns(uint) {
      // Deadline commitments can only be marked complete if a confirmation
      // was submitted within the window
      if (block.timestamp < deadline || deadlineMet ) {
         return 0;
      }
      return 1;
   }
} 