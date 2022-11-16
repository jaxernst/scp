// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../Commitment.sol";

contract BaseCommitment is Commitment {
    string public completionTask;
    function _decodeInitData(bytes calldata initData) internal override {
        completionTask = abi.decode(initData, (string));
    }
}