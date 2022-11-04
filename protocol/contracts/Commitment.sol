// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ICommitment {
    enum Status {
        Active,
        Complete,
        Terminated,
        Paused
    }
    function init(string calldata, address) external;
}

contract Ownable {
    address owner;
    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }
}

contract Commitment is ICommitment, Ownable {
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