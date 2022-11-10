// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDeadlineCommitment {
    /** Attrs **
     * deadline: timestamp
     * submissionWindow: seconds before deadline completion transaction can be made
     */ 
    function deadline() external view returns(uint);
    function submissionWindow() external view returns(uint);

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
    function submitCompletion(string memory) external;
    function missedProofs() external;
}