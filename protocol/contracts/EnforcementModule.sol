// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Commitment.sol";

abstract contract EnforcementModule {
    uint maxEntries = 100;
    uint entries;
    mapping(address => Commitment) public userCommitments;

    function join(address commitment, bytes memory joinData) public virtual;
    function penalize(address commitment) public virtual;
    function withdraw() public virtual;

}