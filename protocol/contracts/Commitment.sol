// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { ICommitment } from "./interfaces/ICommitment.sol";
import "./types.sol";
import "hardhat/console.sol";


contract Commitment is ICommitment {
    Status public status;
    string public name;
    address public owner;
    uint nextProofId = 1;

    bool initialized = false;
    modifier initializer() {
        require(!initialized, "ALREADY_INITIALIZED");
        owner = tx.origin;
        status = Status.ACTIVE;
        initialized = true;
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    function init(bytes calldata data) public virtual initializer {
        string memory description;
        (name, description) = abi.decode(
            data, 
            (string, string)
        ); 

        emit CommitmentCreated(description);
    }

    function submitConfirmationWithProof(string memory proofUri) public virtual override onlyOwner {
        emit ProofSubmitted(proofUri, ++nextProofId);
    }

    function submitConfirmation() public virtual override onlyOwner {
        emit ConfirmationSubmitted();
    }

    function pause() public virtual override {
        require(status == Status.ACTIVE, "NOT_ACTIVE");
        status = Status.PAUSED;
        emit StatusChanged(status, Status.PAUSED);
    }

    function resume() public virtual override {
        require(status == Status.PAUSED, "NOT_PAUSED");
        status = Status.ACTIVE;
        emit StatusChanged(status, Status.ACTIVE);
    }
    
    function terminate() public virtual override onlyOwner {
        emit StatusChanged(status, Status.CANCELLED);
        status = Status.CANCELLED;
    }
}
