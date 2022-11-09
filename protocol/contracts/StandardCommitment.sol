// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { ICommitment } from "./interfaces/ICommitment.sol";
import { SingleOwner } from "./library/SingleOwner.sol";

import "hardhat/console.sol";

interface IStandardCommitment {
    function pledgeDescription() external returns(string memory);
}

contract StandardCommitment is ICommitment {
     /** Attrs **
     * owner: address
     * pool?: CommitmentPool  
     * status: active | inactive | complete
     * submissions: number
     */

    address public override owner;
    string pledgeDescription;
    Status public status;

    bool public override initialized = false;
    function init(bytes calldata initData) external override {
        require(!initialized);
        owner = tx.origin;
        status = Status.Active;
        initialized = true;
        pledgeDescription = abi.decode(initData, (string));
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