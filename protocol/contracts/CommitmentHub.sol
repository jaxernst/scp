// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Commitment} from "./Commitment.sol";
import "./types.sol";

import "hardhat/console.sol";

/**
 * @notice The commitment factory contains a registry of Commitment implementations,
 * or commitment templates. When creating new commitment implementations, they must be
 * audited and approved, so the registration process is currently permissioned.
 * 
 * ToDo: Manage commitment registration through governance
 */
contract CommitmentFactory is Ownable {
    mapping(RegisteredCommitmentType => address) public commitTemplateRegistry;

    function _createCommitment(RegisteredCommitmentType _type)
        internal
        returns (Commitment)
    {
        require(
            commitTemplateRegistry[_type] != address(0),
            "Type Not Registered"
        );
        return Commitment(Clones.clone(commitTemplateRegistry[_type]));
    }

    function registerCommitType(
        RegisteredCommitmentType _type,
        address deployedAt
    ) public onlyOwner {
        require(commitTemplateRegistry[_type] == address(0), "Type registered");
        commitTemplateRegistry[_type] = deployedAt;
    }
}

/**
 * @notice Manage the process of creating new commitmenets and tracking currently deployed commitments.
 * The stores deployed commitments and contains events for frontends to index and track
 * user's commitments
 * 
 * Commitments and Commitment pools deployed from the hub are deployed as Minimal Proxies (clones), to reduce gas
 * costs.
 */
contract CommitmentHub is CommitmentFactory {
    uint public nextCommitmentId = 1;
    mapping(uint => Commitment) public commitments;

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
        Commitment commitment = _createCommitment(_type);
        commitment.init(_initData);
        commitments[++nextCommitmentId] = Commitment(commitment);
        emit CommitmentCreation(msg.sender, _type, address(commitment));
    }
}
