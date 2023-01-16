// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BaseCommitment} from "./BaseCommitment.sol";
import "./types.sol";

import "hardhat/console.sol";

/**
 * @dev This contract should eventually implement functionality to add more commitment
 * types. As new commitment types are added, they can be deployed externally, and their
 * address can be registered here
 */
contract CommitmentFactory is Ownable {
    mapping(RegisteredCommitmentType => address) public commitTemplateRegistry;

    function _createCommitment(RegisteredCommitmentType _type)
        internal
        returns (BaseCommitment)
    {
        require(
            commitTemplateRegistry[_type] != address(0),
            "Type Not Registered"
        );
        return BaseCommitment(Clones.clone(commitTemplateRegistry[_type]));
    }

    function registerCommitType(
        RegisteredCommitmentType _type,
        address deployedAt
    ) public onlyOwner {
        require(commitTemplateRegistry[_type] == address(0), "Type registered");
        commitTemplateRegistry[_type] = deployedAt;
    }
}

contract CommitmentHub is CommitmentFactory {
    uint public nextCommitmentId = 1;
    mapping(uint => BaseCommitment) public commitments;

    event CommitmentCreation(
        address indexed user,
        RegisteredCommitmentType indexed _type,
        address indexed commitmentAddr
    );

    /**
     * Creates and initializes a commitment
     */
    function createCommitment(
        RegisteredCommitmentType _type,
        bytes memory _initData
    ) public {
        BaseCommitment commitment = _createCommitment(_type);
        commitment.init(_initData);
        commitments[++nextCommitmentId] = BaseCommitment(commitment);
        emit CommitmentCreation(msg.sender, _type, address(commitment));
    }
}
