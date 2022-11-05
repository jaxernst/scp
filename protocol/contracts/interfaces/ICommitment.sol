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
}
