// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { DeadlineCommitment } from "./scheduled/DeadlineCommitment.sol";

contract AttestableDeadlineCommitment is DeadlineCommitment {
    uint256 attestationGoal;
    string proofDescription;

    function init(bytes calldata data) public virtual override initializer {
        (
            attestationGoal,
            deadline,
            submissionWindow,
            name,
            commitmentDescription
        ) = abi.decode(
            data, 
            (uint, uint, uint, string, string)
        );
    }   
}
