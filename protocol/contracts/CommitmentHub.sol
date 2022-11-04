// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/Clones.sol";
import { Commitment, ICommitment } from "./Commitment.sol";
import "hardhat/console.sol";

enum CommitmentType {
    Standard
}

contract CommitmentHub {
    uint public nextCommitmentId = 1;
    mapping(CommitmentType => bool) commitmentTemplateDeployed;
    mapping(CommitmentType => address) deployedTemplateAddrs;
    mapping(uint => address) public commitments;

    event CommitmentCreated(address user, address commitmenAddr);

    function createStandardCommitment(string calldata description) public {  
        address commitment;
        if (commitmentTemplateDeployed[CommitmentType.Standard]) {
            console.log("With proxy");
            commitment = Clones.clone(
                deployedTemplateAddrs[CommitmentType.Standard]
            );
        } else {
            console.log("Without proxy");
            commitment =  address(new Commitment());
            commitmentTemplateDeployed[CommitmentType.Standard] = true;
        }

        ICommitment(commitment).init(description, msg.sender);
        commitments[++nextCommitmentId] = commitment;
        emit CommitmentCreated(msg.sender, commitment);
    }
}