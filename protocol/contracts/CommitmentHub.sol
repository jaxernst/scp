// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BaseCommitment} from "./BaseCommitment.sol";
import {ICommitmentHub} from "./interfaces/ICommitmentHub.sol";
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

    // Commit types are standalone commitments that do not require aggregation or management
    function registerCommitType(
        RegisteredCommitmentType _type,
        address deployedAt
    ) public onlyOwner {
        require(commitmentRegistry[_type] == address(0), "TYPE_REGISTERED");
        commitmentRegistry[_type] = deployedAt;
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
contract CommitmentHub is CommitmentFactory, ICommitmentHub {
    uint public nextCommitmentId = 1;
    mapping(uint => BaseCommitment) public commitments; // Lookup commitment by id
    mapping(address => uint) public commitmentIds; // Lookup commitment by address

    event UserJoined(
        RegisteredCommitmentType indexed _type,
        address indexed user,
        address commitmentAddr
    );

    event CommitmentCreation(
        address indexed user,
        RegisteredCommitmentType indexed _type,
        address commitmentAddr,
        uint id
    );

    /**
     * Creates and initializes a commitment
     */
    function createCommitment(
        RegisteredCommitmentType _type,
        bytes memory _initData
    ) public payable {
        BaseCommitment commitment = _createCommitment(_type);
        commitment.init{value: msg.value}(_initData);

        uint id = nextCommitmentId++;
        commitments[id] = commitment;
        commitmentIds[address(commitment)] = id;
        emit CommitmentCreation(msg.sender, _type, address(commitment), id);
    }

    /**
     * Called by commitments to indicate a user has joined the commitment
     */
    function emitUserJoined(
        RegisteredCommitmentType _type,
        address user
    ) external {
        require(
            commitmentIds[msg.sender] != 0,
            "NOT_HUB_REGISTERED_COMMITMENT"
        );
        emit UserJoined(_type, user, msg.sender);
    }
}
