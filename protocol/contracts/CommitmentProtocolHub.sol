pragma solidity ^0.8.0;

import "./AlarmPool.sol";

interface ICommitmentProtocolHub {
    event JoinPool(address indexed user, uint indexed poolId);
    event ExitPool(address indexed user, uint indexed poolId);
    function createAlarmPool(uint16, uint256) external;
    function recordUserJoin(address, uint) external;
    function recordUserExit(address, uint) external;
}

contract CommitmentProtocolHub is ICommitmentProtocolHub {
    // alarm  poolId => CommitmentPool Instance
    mapping(uint => ICommitmentPool) public deployedPools;
    uint public nextPoolId = 1;

    // Deployed commitment pools
    mapping(address => mapping(uint => ICommitmentPool)) public userPools;
    mapping(ICommitmentPool => bool) deployedByHub;

    function createAlarmPool(
        uint16 _missedWakeupPenaltyBps,
        uint256 _wakeupTimeOfDaySeconds
    ) public {
        ICommitmentPool pool = new AlarmPool(
            _missedWakeupPenaltyBps, 
            _wakeupTimeOfDaySeconds,
            nextPoolId
        );

        deployedPools[nextPoolId] = pool;
        deployedByHub[pool] = true;

        nextPoolId++;
    }

    function recordUserJoin(address user, uint poolId) external override {
        require(deployedByHub[ICommitmentPool(msg.sender)], "Error: Forbidden");
        userPools[user][poolId] = ICommitmentPool(msg.sender);
        emit JoinPool(user, poolId);
    }

     function recordUserExit(address user, uint poolId) external override {
        require(deployedByHub[ICommitmentPool(msg.sender)], "Error: Forbidden");
        delete userPools[user][poolId];
        emit ExitPool(user, poolId);
    }

    receive() external payable {}
}
