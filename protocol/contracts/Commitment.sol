// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

abstract contract Commitment {
    event StatusChanged(Status from, Status to);
    enum Status {
        Active,
        Complete,
        Terminated,
        Paused
    }
    
    Status public status;
    address public owner;
    bool initialized = false;
    function init(bytes calldata initData) external {
        require(!initialized, "ALREADY_INITIALIZED");
        owner = tx.origin;
        status = Status.Active;
        initialized = true;
        _decodeInitData(initData);
    }

    function _decodeInitData(bytes calldata initData) internal virtual {}
}
