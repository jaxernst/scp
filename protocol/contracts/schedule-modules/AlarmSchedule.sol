// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

library AlarmSchedule {
    event ScheduleInitialized(uint alarmTime);

    struct Schedule {
        // Init vars
        uint alarmTime; // Seconds after midnight the alarm is to be set for
        uint8[] alarmDays; // Days of the week the alarm is to be set for (1 Sunday)
        uint submissionWindow; // Seconds before the deadline that the user can submit a confirmation
        int timezoneOffset; // The user's timezone offset (+/- 12 hrs) from UTC in seconds
        // Schedule state vars
        uint activationTimestamp;
        uint lastEntryTime;
        bool initialized;
        uint32[7] alarmEntries;
    }

    function init(
        Schedule storage self,
        uint alarmTime,
        uint8[] memory alarmDaysOfWeek,
        uint submissionWindow,
        int timezoneOffset
    ) internal {
        require(_validateDaysArr(alarmDaysOfWeek), "INVALID_DAYS");
        require(alarmTime < 1 days, "INVALID_ALARM_TIME");
        require(
            -43200 < timezoneOffset && timezoneOffset < 43200,
            "INVALID_TIMEZONE_OFFSET"
        );
        self.alarmTime = alarmTime;
        self.alarmDays = alarmDaysOfWeek;
        self.submissionWindow = submissionWindow;
        self.timezoneOffset = timezoneOffset;
        self.initialized = true;

        emit ScheduleInitialized(alarmTime);
    }

    function start(Schedule storage self) internal {
        require(self.initialized, "NOT_INITIALIZED");
        self.activationTimestamp = block.timestamp;
    }

    function entries(
        Schedule storage self
    ) internal view returns (uint confirmations) {
        confirmations = 0;
        for (uint i; i < self.alarmEntries.length; i++) {
            confirmations += self.alarmEntries[i];
        }
    }

    function recordEntry(Schedule storage self) internal {
        uint timeSinceLastEntry = block.timestamp - self.lastEntryTime;
        // Require that the user has waited at least 1 day since last entry (with margin for the submission window)
        require(
            timeSinceLastEntry >= 1 days - self.submissionWindow,
            "ALREADY_SUBMITTED_TODAY"
        );
        require(inSubmissionWindow(self), "NOT_IN_SUBMISSION_WINDOW");
        self.lastEntryTime = block.timestamp;
        uint8 localDay = _dayOfWeek(
            _offsetTimestamp(block.timestamp, self.timezoneOffset)
        );
        self.alarmEntries[localDay - 1]++;
    }

    function inSubmissionWindow(
        Schedule storage self
    ) internal view returns (bool) {
        if (_deadlinePassedToday(self)) {
            return false;
        }
        return
            (_nextDeadlineInterval(self) - block.timestamp) <
            self.submissionWindow;
    }

    /**
     * Determine how many total alarm deadlines have been missed for this schedule.
     * @notice missed wakeups is a function of the alarm activation time,
     * the alarm active days, the last wakeup time, an the user's timezone:
     * missedWakeups = f(activationTime, alarmDays, lastalarmTime, timezoneOffset)
     */
    function missedDeadlines(
        Schedule storage self
    ) internal view returns (uint numMissedDeadlines) {
        uint expectedEntries = 0;
        uint oneWeekInSeconds = 7 days;
        uint currentTime = block.timestamp;
        uint weeksElapsed = (currentTime - self.activationTimestamp) /
            oneWeekInSeconds;

        for (uint i = 0; i < self.alarmDays.length; i++) {
            uint dayOfWeek = self.alarmDays[i];
            uint dayStart = self.activationTimestamp + (dayOfWeek * 1 days);
            if (dayStart + self.alarmTime < currentTime) {
                expectedEntries += weeksElapsed;
                if (
                    currentTime % oneWeekInSeconds >=
                    (dayStart % oneWeekInSeconds) + self.alarmTime
                ) {
                    expectedEntries++;
                }
            }
        }

        if (expectedEntries == 0) {
            return 0;
        }

        return expectedEntries - entries(self);
    }

    function timeToNextDeadline(
        Schedule storage self
    ) internal view returns (uint) {
        uint localTime = _offsetTimestamp(block.timestamp, self.timezoneOffset);
        uint256 currentDay = _dayOfWeek(localTime);
        uint256 currentDayTime = localTime - _lastMidnightTimestamp(self);

        uint256 nextAlarmDay;
        uint256 daysUntilNextAlarm;
        if (currentDayTime >= self.alarmTime) {
            currentDay = (currentDay % 7) + 1;
            daysUntilNextAlarm = 1;
        }

        for (uint8 i = 0; i < self.alarmDays.length; i++) {
            if (
                self.alarmDays[i] >= currentDay &&
                (nextAlarmDay == 0 || self.alarmDays[i] < nextAlarmDay)
            ) {
                nextAlarmDay = self.alarmDays[i];
            }
        }

        if (nextAlarmDay == 0) {
            for (uint8 i = 0; i < self.alarmDays.length; i++) {
                if (nextAlarmDay == 0 || self.alarmDays[i] < nextAlarmDay) {
                    nextAlarmDay = self.alarmDays[i];
                }
            }
            daysUntilNextAlarm += 7 - currentDay + nextAlarmDay;
        } else {
            daysUntilNextAlarm += nextAlarmDay - currentDay;
        }

        return daysUntilNextAlarm * 1 days + self.alarmTime - currentDayTime;
    }

    function _nextDeadlineInterval(
        Schedule storage self
    ) internal view returns (uint256) {
        uint lastMidnight = _lastMidnightTimestamp(self);
        if (_deadlinePassedToday(self)) {
            return lastMidnight + 1 days + self.alarmTime;
        } else {
            return lastMidnight + self.alarmTime;
        }
    }

    function _lastDeadlineInterval(
        Schedule storage self
    ) internal view returns (uint256) {
        uint lastMidnight = _lastMidnightTimestamp(self);
        if (_deadlinePassedToday(self)) {
            return lastMidnight + self.alarmTime;
        } else {
            return lastMidnight - 1 days + self.alarmTime;
        }
    }

    function _deadlinePassedToday(
        Schedule storage self
    ) internal view returns (bool) {
        uint _now = _offsetTimestamp(block.timestamp, self.timezoneOffset);
        return (_now % 1 days) > self.alarmTime;
    }

    /**
     * Deactivations are not allowed if the next wakeup day is included in the user's
     * alarm, and the current time is within x hours before the next wakeup time.
     * (adjusted for the user's timezone)
     */
    function _deactivationAllowed(
        Schedule storage self
    ) internal view returns (bool) {
        return
            missedDeadlines(self) == 0 &&
            _enforceNextWakeup(self) &&
            !inSubmissionWindow(self);
    }

    function _enforceNextWakeup(
        Schedule storage self
    ) internal view returns (bool) {
        // If the day of the commitment's next deadline is in the activeOnDays array,
        // return true
        uint8 nextWakeupDay = _dayOfWeek(_nextDeadlineInterval(self));
        for (uint i; i < self.alarmDays.length; i++) {
            if (self.alarmDays[i] == nextWakeupDay) {
                return true;
            }
        }
        return false;
    }

    // Should a bound be placed on the while loop?
    function _nextAlarmDay(Schedule storage self) internal view returns (uint) {
        uint8 today = _dayOfWeek(
            _offsetTimestamp(block.timestamp, self.timezoneOffset)
        );

        uint8 checkDay = today;
        uint n = 0;

        while (n <= 7) {
            for (uint i; i < self.alarmDays.length; i++) {
                if (self.alarmDays[i] == checkDay) {
                    if (checkDay == today && _deadlinePassedToday(self)) {
                        break;
                    }
                    return checkDay;
                }
            }
            checkDay = (checkDay % 7) + 1;
            n++;
        }
        revert("invariant error");
    }

    // 1 = Sunday, 7 = Saturday
    function _dayOfWeek(
        uint256 timestamp
    ) internal pure returns (uint8 dayOfWeek) {
        uint256 _days = timestamp / 1 days;
        dayOfWeek = uint8(((_days + 4) % 7) + 1);
    }

    function _daysPassed(
        uint256 fromTime,
        uint256 toTime
    ) internal pure returns (uint256) {
        if (toTime < fromTime) return 0;
        return (toTime - fromTime) / 1 days;
    }

    /**
     * @notice 'midnight' is timezone specific so we must offset the timestamp
     */
    function _lastMidnightTimestamp(
        Schedule storage self
    ) internal view returns (uint) {
        uint _now = _offsetTimestamp(block.timestamp, self.timezoneOffset);
        return _now - (_now % 1 days);
    }

    function _offsetTimestamp(
        uint timestamp,
        int offset
    ) internal pure returns (uint256) {
        return uint(int(timestamp) + offset);
    }

    function _validateDaysArr(
        uint8[] memory daysActive
    ) internal pure returns (bool) {
        if (daysActive.length > 7 || daysActive.length == 0) {
            return false;
        }
        for (uint i; i < daysActive.length; i++) {
            if (daysActive[i] == 0 || daysActive[i] > 7) {
                return false;
            }
        }
        return true;
    }
}
