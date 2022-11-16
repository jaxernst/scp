// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../schedule-modules/DeadlineSchedule.sol";

contract AttestableDeadlineCommitment is DeadlineScheduledCommitment {
    uint nextProofId;
    uint256 attestationCount;
    string proofDescription;

    function _decodeInitData(bytes calldata initData) internal override {
        (
            proofDescription,
            deadline,
            submissionWindow
        ) = abi.decode(initData, (string, uint256, uint256));
        __init_deadline_schedule(deadline, submissionWindow);
    }

    function submitConfirmationWithProof(string memory proofUri)
        public
        override
        onlyOwner
    {
        require(_inSubmissionWindow(), "NOT_IN_WINDOW");
        _setDeadlineMet();
        emit ProofSubmitted(proofUri, ++nextProofId);
    }
}
