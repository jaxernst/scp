// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../types.sol";

interface ICommitment {
    event CommitmentInitialized(string description);
    event ConfirmationSubmitted();
    event ProofSubmitted(string uri, uint proofId);
    event ConfirmationRevoked(string uri, uint proofId);
    event StatusChanged(CommitmentStatus from, CommitmentStatus to);
    
    function status() external view returns(CommitmentStatus);
    function name() external view returns(string memory);
    function owner() external view returns(address);
    function submitConfirmationWithProof(string memory) external;
    function submitConfirmation() external;
}





