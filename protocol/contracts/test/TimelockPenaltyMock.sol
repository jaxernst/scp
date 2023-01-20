// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../penalty-modules/TimelockPenalty.sol";

contract TimelockPenaltyMock {
    using TimelockPenalty for TimelockPenalty.Timelock;

    TimelockPenalty.Timelock timelock;

    function init(uint _depositValue, uint _lockDuration) public payable {
        timelock.init(_depositValue, _lockDuration);
    }

    function penalize() public {
        timelock.penalize();
    }

    function withdraw(address payable to) public {
        timelock.withdraw(to);
    }

    function unlockTime() public view returns (uint) {
        return timelock.unlockTime;
    }

    function lockDuration() public view returns (uint) {
        return timelock.lockDuration;
    }

    function depositValue() public view returns (uint) {
        return timelock.depositValue;
    }
}