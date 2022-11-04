pragma solidity ^0.8.0;

import "../AlarmPool.sol";

contract MockAlarmPool is AlarmPool {
    constructor(
        uint16 _missedWakeupPenaltyBps,
        uint256 _firstWakeupTime
    )
        AlarmPool(
            _missedWakeupPenaltyBps,
            _firstWakeupTime
        )
    {}

    function offsetTimestamp(uint timestamp, int offset)
        public
        view
        returns (uint256)
    {
       return _offsetTimestamp(timestamp, offset);
    }

    function daysPassed(uint256 fromTime, uint256 toTime)
        public
        view
        returns (uint256)
    {
        return _daysPassed(fromTime, toTime);
    }

    function deactivationAllowed(address user) public view returns (bool) {
        return _deactivationAllowed(user);
    }

    function enforceNextWakeup(address user) public view returns (bool) {
        return _enforceNextWakeup(user);
    }

    function dayOfWeek(uint256 timestamp)
        public
        view
        returns (uint8)
    {
        return _dayOfWeek(timestamp);
    }

    function validateDaysArr(uint8[] memory daysActive)
        public
        pure
        returns (bool)
    {
        return _validateDaysArr(daysActive);
    }
}
