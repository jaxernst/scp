// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../schedules/DeadlineSchedule.sol";

contract DeadlineScheduleMock {
    using DeadlineSchedule for DeadlineSchedule.Schedule;

    DeadlineSchedule.Schedule schedule;

    function init(uint deadline, uint submissionWindow) public {
        schedule.init(deadline, submissionWindow);
    }

    function entries() public view returns (uint256) {
        return schedule.entries();
    }

    function missedDeadlines() public view returns (uint256) {
       return schedule.missedDeadlines();
    }

    function inSubmissionWindow() public view returns(bool) {
        return schedule.inSubmissionWindow();
    }

    function recordEntry() public {
        return schedule.recordEntry();
    }
}