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
        Complete,
        Terminated,
        Paused,
        Contesting
    }

    Status public status;
    function scheduleType() external view virtual returns(ScheduleType) {
        return ScheduleType.NONE;
    }

    string public name;
    string public commitmentDescription;
    address public owner;

    uint nextProofId = 1;

    bool initialized = false;
    function __init__BaseCommitment(bytes memory data) public initializer returns(bool) {
        owner = tx.origin;
        status = Status.Active;
        initialized = true;
        (name, commitmentDescription) = abi.decode(data, (string, string));
        return true;
    }

    modifier initializer() {
        require(!initialized, "ALREADY_INITIALIZED");
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
        emit StatusChanged(status, Status.Terminated);
        status = Status.Terminated;
    }
}
