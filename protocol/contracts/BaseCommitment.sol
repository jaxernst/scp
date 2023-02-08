// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { ICommitment } from "./interfaces/ICommitment.sol";
import "./types.sol";
import "hardhat/console.sol";

/**
 * The base commitment defines the most primitive commitment implementation, where
 * the only functionality includes confirming (with or without proof) that the commitment
 * was completed, and emitting events to log commitment submissions.
 * 
 * @dev Customized commitments inhereit from this contract, and can override functions as needed.
 */
contract BaseCommitment is ICommitment {
    string public name;
    CommitmentStatus public status;
    address public owner;
    uint nextProofId = 1;

    bool initialized = false;
    modifier initializer() {
        require(!initialized, "ALREADY_INITIALIZED");
        owner = tx.origin;
        status = CommitmentStatus.ACTIVE;
        initialized = true;
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    function init(bytes calldata data) public payable virtual initializer {
        string memory description;
        (name, description) = abi.decode(
            data, 
            (string, string)
        ); 

        emit CommitmentInitialized(description);
    }

    function submitConfirmationWithProof(string memory proofUri) public virtual override onlyOwner {
        emit ProofSubmitted(proofUri, ++nextProofId);
        submitConfirmation();
    }

    /**
     * @notice The base commitment will change its status to complete upon confirmation
     * but derived commitments to not have to abide by this state change
     */
    function submitConfirmation() public virtual override onlyOwner {
        emit ConfirmationSubmitted();
        emit StatusChanged(status, CommitmentStatus.COMPLETE);
        status = CommitmentStatus.COMPLETE;
    }
}
