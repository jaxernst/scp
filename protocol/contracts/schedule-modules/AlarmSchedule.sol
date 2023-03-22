// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library AlarmSchedule {
    struct Schedule {
        // Init vars
        uint alarmTime;
        uint alarmDaysOfWeek;
        uint submissionWindow;
        uint timezoneOffset;
        // Schedule state vars
        uint startTime;
        uint entries;
    }

    function init(
        Schedule storage self,
        uint alarmTime,
        uint alarmDaysOfWeek,
        uint submissionWindow,
        uint timezoneOffset
    ) internal {
        self.alarmTime = alarmTime;
        self.alarmDaysOfWeek = alarmDaysOfWeek;
        self.submissionWindow = submissionWindow;
        self.timezoneOffset = timezoneOffset;
    }

    function start(Schedule storage self) public {
        self.startTime = block.timestamp;
    }

    function entries(Schedule storage self) internal view returns (uint) {
        // Return sum of the entries array
    }

    function recordEntry(Schedule storage self) internal {
        // Get the day of week from block.timestamp and use that timestamp
        // to figure out the current time of day (in seconds after midnight), and check
        // if the time of day (in seconds after midnight) is before the alarmTime but within
        // submissionWindow seconds of the alarmTime. If so, we increment the entries array for
        // the current day of the week index (0 - Monday through 6 - Sunday)
    }

    function missedDeadlines(
        Schedule storage self
    ) internal view returns (uint) {
        // Based on the startTime, the days of week the alarm is active on, and the current time,
        // calculate the expect amount of 'entries' (or alarms) that should have been recorded,
        // and return the amount missed
    }

    function inSubmissionWindow(
        Schedule storage self
    ) internal view returns (bool) {}

    // Get the day of the week from block.timestamp (1 for Monday through 7 for sunday)
    function _dayOfTheWeek() private {}

    // Get the current time of day as seconds after midnight (hint: block.timestamp use UTC time)
    function _timeOfDay() private {}
}
