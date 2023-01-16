// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IScheduledCommitments.sol";

interface IEnforcementModule {
    event UserJoined(uint id);
    event UserExit(uint id);
    
    function join(IScheduledCommitment commitment, bytes calldata joinData) external payable;
    function penalize(address user) external;
    function exit() external;
}