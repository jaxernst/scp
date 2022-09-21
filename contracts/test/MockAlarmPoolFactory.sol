pragma solidity ^0.8.0;

import "../AlarmPool.sol";

contract MockAlarmPoolFactory {
    function deployAlarmPool(
        uint8 _missedWakeupPenaltyBps,
        uint256 _firstWakeupTime
    ) public returns (address) {
        return
            address(new AlarmPool(_missedWakeupPenaltyBps, _firstWakeupTime));
    }
}
