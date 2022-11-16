// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DeadlineCommitment.sol";
import "../schedule-modules/DeadlineSchedule.sol";

contract AttestableDeadlineCommitment is DeadlineSchedule, Commitment {
    uint nextProofId;
    uint256 attestations;
    string proofDescription;
    string commitmentDescription;

    function _decodeInitData(bytes calldata initData) internal override {
        (
            proofDescription,
            commitmentDescription,
            deadline,
            submissionWindow
        ) = abi.decode(initData, (string, string, uint256, uint256));
        __init_deadline_schedule(deadline, submissionWindow);
    }

    function submitConfirmationWithProof(string memory proofUri)
        public
        override
        onlyOwner
    {
        require(inSubmissionWindow(), "NOT_IN_WINDOW");
        setDeadlineMet();
        emit ProofSubmitted(proofUri, ++nextProofId);
    }
}
