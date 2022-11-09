// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ICommitment {
    enum Status {
        Active,
        Complete,
        Terminated,
        Paused
    }
    
    function owner() external view returns(address);
    function status() external view returns(Status);
    function initialized() external view returns(bool);
    function init(bytes calldata initData) external;
}
