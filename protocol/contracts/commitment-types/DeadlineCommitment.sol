// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { Commitment } from "../Commitment.sol";
import "../interfaces/IDeadlineCommitment.sol";

contract DeadlineCommitment is Commitment, IDeadlineCommitment {
   /** Attrs **
   * deadline: timestamp
   * submissionWindow: seconds before deadline completion transaction can be made
   */ 

   string public description;
   uint public deadline;
   uint public submissionWindow;

   function _decodeInitData(bytes calldata initData) internal override {
      (description, deadline, submissionWindow) = abi.decode(initData, (string, uint, uint));
      require(block.timestamp < deadline, "DEADLINE_PASSED");
   }

   function submitConfirmation() public override onlyOwner {
      require(block.timestamp <= deadline, "DEADLINE_MISSED");
      require(deadline - submissionWindow < block.timestamp, "NOT_IN_WINDOW");
      emit ConfirmationSubmitted();
      _markComplete();
   }

   function missedDeadlines() public view override returns(uint) {
      // Deadline commitments can only be marked complete if a confirmation
      // was submitted within the window
      if (block.timestamp < deadline || status == Status.Complete) {
         return 0;
      }
      return 1;
   }
} 