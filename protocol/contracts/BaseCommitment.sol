// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ScheduleTypes.sol";
import "hardhat/console.sol";

contract BaseCommitment {
    event ConfirmationSubmitted();
    event ProofSubmitted(string proofURI, uint proofId);
    event StatusChanged(Status from, Status to);
    enum Status {
        Active,
        Paused,
        Complete,
        Cancelled
    }

    Status public status;
    function scheduleType() external view virtual returns(ScheduleType) {
        return ScheduleType.NONE;
    }

    string public name;
    string public commitmentDescription;
    address public owner;

    uint nextProofId = 1;

    function init(bytes calldata data) public virtual initializer {
        (name, commitmentDescription) = abi.decode(
            data, 
            (string, string)
        ); 
    }

    bool initialized = false;
    modifier initializer() {
        require(!initialized, "ALREADY_INITIALIZED");
        owner = tx.origin;
        status = Status.Active;
        initialized = true;
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    function submitConfirmationWithProof(string memory proofUri) public virtual onlyOwner {
        emit ProofSubmitted(proofUri, ++nextProofId);
    }

    function submitConfirmation() public virtual onlyOwner {
        emit ConfirmationSubmitted();
    }

    function missedDeadlines() public virtual view returns(uint) {
        revert("NOT_IMPLEMENTED");
    }
    
    function terminate() public virtual onlyOwner {
        emit StatusChanged(status, Status.Cancelled);
        status = Status.Cancelled;
    }
}
