// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { Commitment } from "./Commitment.sol";
import "./interfaces/IDeadlineCommitment.sol";

contract DeadlineCommitment is Commitment {
    /** Attrs **
     * deadline: timestamp
     * submissionWindow: seconds before deadline completion transaction can be made
     */ 

    string public name;
    string public description;
    uint public deadline;
    uint public submissionWindow;

   function _decodeInitData(bytes memory data) internal override {
      (name, description, deadline, submissionWindow) = abi.decode(
         data,
         (string, string, uint, uint)
      );
   }

    /** External Functions **
     * submitProof() override onlyOwner
     *  - Require: submissions = 0
        - Require: in submission window
     *  - State changes:
     *      submissions++
     *      status = complete
     *
     * missedProofs() override
     */

} 