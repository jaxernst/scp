// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BaseCommitment} from "./BaseCommitment.sol";
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
    mapping(RegisteredCommitmentType => address) public commitmentRegistry;

    function _createCommitment(
        RegisteredCommitmentType _type
    ) internal returns (BaseCommitment) {
        require(commitmentRegistry[_type] != address(0), "TYPE_NOT_REGISTERED");
        return BaseCommitment(Clones.clone(commitmentRegistry[_type]));
    }

    // Commit types are standalone commitments that do not require aggreation or management
    function registerCommitType(
        RegisteredCommitmentType _type,
        address deployedAt
    ) public onlyOwner {
        require(commitmentRegistry[_type] == address(0), "TYPE_REGISTERED");
        commitmentRegistry[_type] = deployedAt;
    }

    // Sub hubs are commitment deployers with specialized functionality to manage the commitments
    // deployed under them.
    function registerSubHub() onlyOwner {}
}

/**
 * @notice Manage the process of creating new commitmenets and tracking currently deployed commitments.
 * The stores deployed commitments and contains events for frontends to index and track
 * user's commitments
 *
 * Commitments and Commitment pools deployed from the hub are deployed as Minimal Proxies (clones), to reduce gas
 * costs.
 */
contract ScpHub is CommitmentFactory {
    uint public nextCommitmentId = 1;
    mapping(uint => BaseCommitment) public commitments;
    mapping(uint => CommitmentHub) public hubs;

    event CommitmentCreation(
        address indexed user,
        RegisteredCommitmentType indexed _type,
        address commitmentAddr,
        uint id
    );

    event HubCreation(
        address indexed creator
        address indexed hubAddr
    )

    /**
     * Creates and initializes a commitment
     */
    function createCommitment(
        RegisteredCommitmentType _type,
        bytes memory _initData
    ) public payable {
        BaseCommitment commitment = _createCommitment(_type);
        commitment.init{value: msg.value}(_initData);

        uint id = ++nextCommitmentId;
        commitments[id] = commitment;
        emit CommitmentCreation(msg.sender, _type, address(commitment), id);
    }
}
