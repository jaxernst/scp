// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Commitment } from "./Commitment.sol";
import "hardhat/console.sol";

enum CommitmentType {
    Base,
    Deadline
}

/** 
 * @dev This contract should eventually implement functionality to add more commitment
 * types. As new commitment types are added, they can be deployed externally, and their
 * address can be registered here
*/
contract CommitmentFactory is Ownable {
    mapping(CommitmentType => address) public commitTemplateRegistry;
    function _createCommitment(CommitmentType _type) internal returns(Commitment) {
        require(commitTemplateRegistry[_type]!= address(0), "Type Not Registered");
        return Commitment(Clones.clone(commitTemplateRegistry[_type]));
    }

    function registerCommitType(CommitmentType _type, address deployedAt) public onlyOwner {
        require(commitTemplateRegistry[_type] == address(0), "Type registered");
        commitTemplateRegistry[_type] = deployedAt;
    }
}

contract CommitmentHub is CommitmentFactory {
    uint public nextCommitmentId = 1;
    mapping(uint => Commitment) public commitments;

    event CommitmentCreation(
        address indexed user, 
        CommitmentType indexed _type, 
        address indexed commitmentAddr
    );

    /** 
     * Creates and initializes a commitment 
     */
    function createCommitment(
        CommitmentType _type, 
        string memory _name, 
        bytes memory _data
    ) public {
        Commitment commitment = _createCommitment(_type);
        commitment.init(_name, _data);
        commitments[++nextCommitmentId] = Commitment(commitment);
        emit CommitmentCreation(msg.sender, _type, address(commitment));
    }
}