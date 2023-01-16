// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { DeadlineCommitment } from "./scheduled/DeadlineCommitment.sol";

/** 
 * @dev Implementation not complete
 * @notice Attestable commitments are commitments that allow other users to attest
 * to confirmation proofs.
 */
contract AttestableCommitment is DeadlineCommitment {
    uint256 attestationGoal;
    string proofDescription;

    function init(bytes calldata data) public virtual override initializer {
        string memory description;
        (
            attestationGoal,
            deadline,
            submissionWindow,
            name,
            description
        ) = abi.decode(
            data, 
            (uint, uint, uint, string, string)
        );
        emit CommitmentCreated(description);
    } 

    // function attest() public {}  
}
