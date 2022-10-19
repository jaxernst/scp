pragma solidity ^0.8.0;

import "./AlarmPool.sol";

interface ICommitmentProtocolHub {
    function recordUserJoin(address) external;
    function recordUserExit(address) external;
}

contract CommitmentProtocolHub is ICommitmentProtocolHub {
    mapping(address => bool) public activeUsers;

    // alarm time => poolId => CommitmentPool Instance
    mapping(uint => mapping(uint => ICommitmentPool)) deployedPools;
    uint nextPoolId;

    // Deployed commitment pools
    mapping(address => ICommitmentPool) userPools;
    mapping(ICommitmentPool => bool) deployedByHub;

    function createAlarmPool(
        uint16 _missedWakeupPenaltyBps,
        uint256 _wakeupTimeOfDaySeconds
    ) public {
        ICommitmentPool pool = new AlarmPool(
            _missedWakeupPenaltyBps, 
            _wakeupTimeOfDaySeconds
        );

        deployedPools[_wakeupTimeOfDaySeconds][nextPoolId] = pool;
        deployedByHub[pool] = true;

        nextPoolId++;
    }

    function recordUserJoin(address user) external override {
        require(deployedByHub[ICommitmentPool(msg.sender)], "Error: Forbidden");
        userPools[user] = ICommitmentPool(msg.sender);
    }

     function recordUserExit(address user) external override {
        require(deployedByHub[ICommitmentPool(msg.sender)], "Error: Forbidden");
        delete userPools[user];
    }
}
