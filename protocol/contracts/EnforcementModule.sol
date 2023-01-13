// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./BaseCommitment.sol";
import "./commitment-types/scheduled/DeadlineCommitment.sol";

/**
 * Template that enforcement modules must implement. 
 */
abstract contract EnforcementModule {
    function join(DeadlineCommitment commitment, bytes calldata joinData) public payable virtual;
    function penalize(address user) public virtual;
    function exit() public virtual;
}