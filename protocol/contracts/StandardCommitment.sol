// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { ICommitment } from "./interfaces/ICommitment.sol";
import { SingleOwner } from "./library/SingleOwner.sol";

import "hardhat/console.sol";

interface IStandardCommitment {
    function init(string calldata) external;
}

contract StandardCommitment is ICommitment, IStandardCommitment {
     /** Attrs **
     * owner: address
     * pool?: CommitmentPool  
     * status: active | inactive | complete
     * submissions: number
     */

    address public override owner;
    string description;
    Status status;

    constructor() {
        console.log("Set owner", tx.origin);
        console.log("This addr", address(this));
        owner = tx.origin;
    }

    bool initialized = false;
    function init(string calldata _description) external override {
        require(!initialized);
        description = _description;
        status = Status.Active;
        initialized = true;
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