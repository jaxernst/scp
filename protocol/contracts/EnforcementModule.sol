// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Commitment.sol";

abstract contract EnforcementModule {
    uint maxEntries = 100;
    uint entries;
    mapping(address => Commitment) public userCommitments;
}