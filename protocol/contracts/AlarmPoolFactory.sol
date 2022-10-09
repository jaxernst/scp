pragma solidity ^0.8.0;

import "./AlarmPool.sol";

contract AlarmPoolFactory {
    mapping(address => bool) public activeUsers;

    // wakeup time => poolId => AlarmPool Instance
    mapping(uint => mapping(uint => IAlarmPool)) deployedPools;
    uint nextPoolId = 1;

    mapping(address => bool) private isManagedPool;

    function createPool(
        uint16 _missedWakeupPenaltyBps,
        uint256 _wakeupTimeOfDaySeconds
    ) public {
        IAlarmPool pool = new AlarmPool(
            _missedWakeupPenaltyBps, 
            _wakeupTimeOfDaySeconds
        );

        deployedPools[_wakeupTimeOfDaySeconds][nextPoolId] = pool;
        nextPoolId++;
    }

    function joinPool
}
