// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./schedule-modules/ScheduleTypes.sol";

abstract contract Commitment {
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
    bool initialized = false;
    
    function init(
        string memory _name, 
        string memory _commitmentDescription,
        bytes calldata initData
    ) external {
        require(!initialized, "ALREADY_INITIALIZED");
        owner = tx.origin;
        status = Status.Active;
        initialized = true;
        name = _name;
        commitmentDescription = _commitmentDescription;

        _decodeInitData(initData);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    function _decodeInitData(bytes calldata initData) internal virtual;

    function submitConfirmationWithProof(string memory proofUri) public virtual onlyOwner {
        revert("NOT_IMPLEMENTED");
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
    
    function _markComplete() internal virtual {
        emit StatusChanged(status, Status.Complete);
        status = Status.Complete;
    }
}
