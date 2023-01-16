// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../types.sol";

interface IBaseCommitment {
    event CommitmentCreated(string description);
    event ConfirmationSubmitted();
    event ProofSubmitted(string uri, uint proofId);
    event StatusChanged(Status from, Status to);
    
    function status() external view returns(Status);
    function name() external view returns(string memory);
    function owner() external view returns(address);
    function submitConfirmationWithProof(string memory) external;
    function submitConfirmation() external;
    function pause() external;
    function resume() external;
    function terminate() external;
}





