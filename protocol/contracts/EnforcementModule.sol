// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Commitment.sol";

abstract contract EnforcementModule {
    uint entries;

    //function join(address commitment, bytes memory joinData) public payable virtual;
    //function exit() public virtual;
    //function penalize(address commitment) public virtual;
}