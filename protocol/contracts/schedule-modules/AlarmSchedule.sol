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

    modifier started(Schedule storage self) {
        require(self.activationTimestamp > 0, "NOT_STARTED");
        _;
    }

    function init(
        uint alarmTime,
        uint8[] memory alarmDaysOfWeek,
        uint submissionWindow,
        int timezoneOffset
    ) internal returns (Schedule memory) {
        require(_validateDaysArr(alarmDaysOfWeek), "INVALID_DAYS");
        require(alarmTime < 1 days, "INVALID_ALARM_TIME");
        require(
            -43200 < timezoneOffset && timezoneOffset < 43200,
            "INVALID_TIMEZONE_OFFSET"
        );

        emit ScheduleInitialized(alarmTime);

        Schedule memory schedule;
        schedule.alarmTime = alarmTime;
        schedule.alarmDays = alarmDaysOfWeek;
        schedule.submissionWindow = submissionWindow;
        schedule.timezoneOffset = timezoneOffset;
        schedule.initialized = true;
        schedule.activationTimestamp = 0;
        return schedule;
    }

    function start(Schedule storage self) internal {
        require(self.initialized, "NOT_INITIALIZED");
        self.activationTimestamp = _nextDeadlineInterval(self);
    }

    function entries(
        Schedule storage self
    ) internal view started(self) returns (uint confirmations) {
        confirmations = 0;
        for (uint i; i < self.alarmEntries.length; i++) {
            confirmations += self.alarmEntries[i];
        }
    }

    function recordEntry(Schedule storage self) internal started(self) {
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
    ) internal view started(self) returns (bool) {
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
    ) internal view started(self) returns (uint numMissedDeadlines) {
        if (block.timestamp < self.activationTimestamp) return 0;

        // The current day of week is taken from the last deadline time (timezone adjusted)
        uint256 curDay = _dayOfWeek(
            _offsetTimestamp(block.timestamp, self.timezoneOffset)
        );

        uint8 activationDay = _dayOfWeek(
            _offsetTimestamp(self.activationTimestamp, self.timezoneOffset)
        );

        uint256 daysPassed = (block.timestamp - self.activationTimestamp) /
            1 days;

        // The expected amount of confirmations for any given alarm day is at least
        // the amount of weeks elasped.
        uint minConfirmations = daysPassed / 7;

        for (uint i; i < self.alarmDays.length; i++) {
            uint8 checkDay = self.alarmDays[i];
            uint expectedConfirmationsOnThisDay = minConfirmations;
            uint actualConfirmationsOnThisDay = uint(
                self.alarmEntries[checkDay - 1]
            );

            if (activationDay <= checkDay && checkDay < curDay) {
                expectedConfirmationsOnThisDay++;
            }
            if (checkDay == curDay && _deadlinePassedToday(self)) {
                expectedConfirmationsOnThisDay++;
            }

            if (expectedConfirmationsOnThisDay > actualConfirmationsOnThisDay) {
                numMissedDeadlines +=
                    expectedConfirmationsOnThisDay -
                    actualConfirmationsOnThisDay;
            }
        }
    }

    function timeToNextDeadline(
        Schedule storage self
    ) internal view started(self) returns (uint) {
        return nextDeadlineTimestamp(self) - block.timestamp;
    }

    function nextDeadlineTimestamp(
        Schedule storage self
    ) internal view started(self) returns (uint) {
        uint referenceTimestamp = _lastDeadlineInterval(self);

        uint8 curDay = _dayOfWeek(
            _offsetTimestamp(referenceTimestamp, self.timezoneOffset)
        );

        // Get next alarm day
        uint8 nextDay = _nextAlarmDay(self, curDay);

        uint8 daysAway;
        if (nextDay >= curDay) {
            daysAway = nextDay - curDay;
        } else {
            daysAway = 7 - curDay + _nextAlarmDay(self, 0);
        }

        return referenceTimestamp + uint(daysAway) * 1 days;
    }

    function _nextAlarmDay(
        Schedule storage self,
        uint8 currentDay
    ) internal view returns (uint8) {
        /**
         * Iterate over the alarmDays and take the first day that that's greater than today
         * If there are none, return the earliest alarmDay (lowest index)
         */
        for (uint i; i < self.alarmDays.length; i++) {
            if (self.alarmDays[i] > currentDay) {
                return self.alarmDays[i];
            }
        }

        return self.alarmDays[0];
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
     * @notice 'midnight' is timezone specific so we must offset the timestamp before taking the modulus.
     * this is like pretending UTC started in the user's timezone instead of GMT.
     */
    function _lastMidnightTimestamp(
        Schedule storage self
    ) internal view returns (uint) {
        uint localTimestamp = _offsetTimestamp(
            block.timestamp,
            self.timezoneOffset
        );
        uint lastMidnightLocal = localTimestamp - (localTimestamp % 1 days);
        return _offsetTimestamp(lastMidnightLocal, -self.timezoneOffset);
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
        uint8 lastDay;
        for (uint i; i < daysActive.length; i++) {
            uint8 day = daysActive[i];
            if (day == 0 || day > 7 || lastDay > day) {
                return false;
            }
            lastDay = day;
        }
        return true;
    }
}
