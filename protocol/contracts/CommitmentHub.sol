// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { StandardCommitment, IStandardCommitment } from "./StandardCommitment.sol";
import { ICommitment } from "./interfaces/ICommitment.sol";
import "hardhat/console.sol";

enum CommitmentType {
    Standard
}

/** 
 * @dev This contract should eventually implement functionality to add more commitment
 * types. As new commitment types are added, they can be deployed externally, and their
 * address can be registered here
*/
contract CommitmentFactory is Ownable {
    mapping(CommitmentType => address) public templateRegistry;
    function _createCommitment(CommitmentType _type) internal returns(address) {
        require(templateRegistry[_type]!= address(0), "Type Not Registered");
        return Clones.clone(templateRegistry[_type]);
    }

    function registerType(CommitmentType _type, address deployedAt) public onlyOwner {
        require(templateRegistry[_type] == address(0), "Type registered");
        templateRegistry[_type] = deployedAt;
    }
}

contract CommitmentHub is CommitmentFactory {
    uint public nextCommitmentId = 1;
    mapping(uint => ICommitment) public commitments;

    event CommitmentCreation(
        address indexed user, 
        CommitmentType indexed _type, 
        address indexed commitmentAddr);

    /** 
     * Creates and initializes a standard commitment 
     */
    function createStandardCommitment(string calldata description) public {  
        address commitment = _createCommitment(CommitmentType.Standard);
        IStandardCommitment(commitment).init(description);
        commitments[++nextCommitmentId] = ICommitment(commitment);
        emit CommitmentCreation(msg.sender, CommitmentType.Standard, commitment);
    }

    function createCommitment(CommitmentType _type) public {
        address commitment = _createCommitment(_type);
        commitments[++nextCommitmentId] = ICommitment(commitment);
        emit CommitmentCreation(msg.sender, _type, commitment);
    }
}