// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { ICommitment } from "./interfaces/ICommitment.sol";
import { SingleOwner } from "./library/SingleOwner.sol";

interface IStandardCommitment is ICommitment {
    function init(string calldata, address) external;
}

contract StandardCommitment is ICommitment, IStandardCommitment, SingleOwner {
     /** Attrs **
     * owner: address
     * pool?: CommitmentPool  
     * status: active | inactive | complete
     * submissions: number
     */

    string description;
    Status status;

    function init(string calldata _description, address _owner) external override {
        owner = _owner;
        description = description;
        status = Status.Active;
    }

    /** Events **
     * ProofSubmitted(uri)
     */

    /** External Functions **
     * submitProof() virtual
     * joinPool() onlyOwner
     * endCommitment() onlyOwner
     */
}