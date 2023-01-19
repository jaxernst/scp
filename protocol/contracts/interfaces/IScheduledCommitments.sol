// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ICommitment.sol";
import "../types.sol";


interface ISchedule {
    event DeadlineMissed();
    function scheduleType() external view returns(ScheduleType);
    function submissionWindow() external view returns(uint);
    function inSubmissionWindow() external view returns(bool);
    function missedDeadlines() external view returns(uint);
    function nextDeadline() external view returns(uint);
}

interface IDeadlineSchedule is ISchedule {
    function deadline() external view returns(uint);
}

interface IAlarmSchedule is ISchedule {
    // function activeDays() external view returns(uint8[] memory);
    function alarmTime() external view returns(uint);
}

interface IScheduledCommitment is ISchedule, ICommitment {}
interface IDeadlineCommitment is IDeadlineSchedule, ICommitment {}
interface IAlarmCommitment is IAlarmSchedule, ICommitment {}