// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../Commitment.sol";

contract BaseCommitment is Commitment {
    string public description;
    function _decodeInitData(bytes calldata initData) internal override {
        description = abi.decode(initData, (string));
    }
}