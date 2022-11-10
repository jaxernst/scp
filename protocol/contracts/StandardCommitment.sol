// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { Commitment } from "./Commitment.sol";
import { SingleOwner } from "./library/SingleOwner.sol";

import "hardhat/console.sol";

interface IStandardCommitment {
    function pledgeDescription() external returns(string memory);
}

contract StandardCommitment is Commitment {
     /** Attrs **
     * owner: address
     * pool?: CommitmentPool  
     * status: active | inactive | complete
     * submissions: number
     */

    string public name;
    string public description;
    
    function _decodeInitData(bytes calldata data) internal override {
        (name, description) = abi.decode(data, (string, string));
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