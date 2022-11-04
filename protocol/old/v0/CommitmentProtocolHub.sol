pragma solidity ^0.8.0;

import "./AlarmPool.sol";

interface ICommitmentProtocolHub {
    function recordUserJoin(address) external;
    function recordUserExit(address) external;
}

contract CommitmentProtocolHub is ICommitmentProtocolHub {
    // alarm  poolId => CommitmentPool Instance
    mapping(uint => ICommitmentPool) public deployedPools;
    uint public nextPoolId = 1;

    // Deployed commitment pools
    mapping(address => ICommitmentPool) public userPools;
    mapping(ICommitmentPool => bool) deployedByHub;

    function createAlarmPool(
        uint16 _missedWakeupPenaltyBps,
        uint256 _wakeupTimeOfDaySeconds
    ) public {
        ICommitmentPool pool = new AlarmPool(
            _missedWakeupPenaltyBps, 
            _wakeupTimeOfDaySeconds
        );

        deployedPools[nextPoolId] = pool;
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

    receive() external payable {}
}
