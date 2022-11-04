pragma solidity ^0.8.0;

import "../AlarmPool.sol";

contract MockAlarmPoolFactory {
    address alarmPool;

    function deployAlarmPool(
        uint16 _missedWakeupPenaltyBps,
        uint256 _firstWakeupTime
    ) public {
        alarmPool = address(
            new AlarmPool(_missedWakeupPenaltyBps, _firstWakeupTime, 0)
        );
    }

    function getAlarmPool() public view returns (address) {
        return alarmPool;
    }

    receive() external payable {}
}
