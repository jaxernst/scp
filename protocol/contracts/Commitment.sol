// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

abstract contract Commitment {
    event ConfirmationSubmitted();
    event ProofSubmitted(string proofURI);

    event StatusChanged(Status from, Status to);
    enum Status {
        Active,
        Complete,
        Terminated,
        Paused,
        Contesting
    }

    string public name;
    Status public status;
    address public owner;
    bool initialized = false;
    function init(
        string memory _name, 
        bytes calldata initData
    ) external {
        require(!initialized, "ALREADY_INITIALIZED");
        owner = tx.origin;
        status = Status.Active;
        initialized = true;
        name = _name;
        _decodeInitData(initData);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    function _decodeInitData(bytes calldata initData) internal virtual {}
    
    function submitProof(string memory proofUri) public virtual onlyOwner {
        emit ProofSubmitted(proofUri);
    }

    function submitConfirmation() public virtual onlyOwner {
        emit ConfirmationSubmitted();
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
