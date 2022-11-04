// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SingleOwner {
    address owner;
    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }
}