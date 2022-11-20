// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { DeadlineCommitment } from "./scheduled/DeadlineCommitment.sol";

contract AttestableDeadlineCommitment is DeadlineCommitment {
    uint256 attestationCount;
    uint256 attestationGoal;
    string proofDescription;

    function __init__AttestableDeadlineCommitment(
        bytes memory data
    ) public initializer returns(bool) {
        bytes memory dataParent;
        (attestationGoal, proofDescription, dataParent) = abi.decode(
            data, 
            (uint, string, bytes)
        );
        return __init__DeadlineCommitment(dataParent);
    }
}
