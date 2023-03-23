// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library AlarmSchedule {
    uint constant SECONDS_PER_DAY = 1 days;

    struct Schedule {
        // Init vars
        uint alarmTime;
        uint8[] alarmDays;
        uint submissionWindow;
        int timezoneOffset;
        // Schedule state vars
        uint activationTime;
        uint32[7] entries;
    }

    function init(
        Schedule storage self,
        uint alarmTime,
        uint8[] calldata alarmDaysOfWeek,
        uint submissionWindow,
        int timezoneOffset
    ) internal {
        self.alarmTime = alarmTime;
        self.alarmDays = alarmDaysOfWeek;
        self.submissionWindow = submissionWindow;
        self.timezoneOffset = timezoneOffset;
    }

    function start(Schedule storage self) public {
        self.activationTime = block.timestamp;
    }

    function entries(Schedule storage self) internal view returns (uint) {
        uint confirmations = 0;
        for (uint i; i < self.alarmDays.length; i++) {
            confirmations += self.entries[self.alarmDays[i]];
        }
    }

    function recordEntry(Schedule storage self) internal {
        require(inSubmissionWindow(self), "NOT_IN_SUBMISSION_WINDOW");
        self.entries[_dayOfWeek(block.timestamp)]++;
    }

    function inSubmissionWindow(
        Schedule storage self
    ) public view returns (bool) {
        if (_deadlinePassedToday(self)) return false;
        return (nextDeadline(self) - block.timestamp) < self.submissionWindow;
    }

    function totalConfirmations() external view returns (uint confirmations) {}

    /**
     * Determine how many total alarm deadlines have been missed for this scheulde.
     * @notice missed wakeups is a function of the alarm activation time,
     * the alarm active days, the last wakeup time, an the user's timezone:
     * missedWakeups = f(activationTime, alarmDays, lastalarmTime, timezoneOffset)
     */
    function missedDeadlines(
        Schedule storage self
    ) internal view returns (uint numMissedDeadlines) {
        uint256 daysPassed = _daysPassed(self.activationTime, block.timestamp);

        // The current day of week is taken from the last deadline time (timezone adjusted)
        uint256 lastDeadlineDay = _dayOfWeek(lastDeadline(self));

        uint8 activationDay = _dayOfWeek(self.activationTime);

        // The expected amount of confirmations for any given alarm day is at least
        // the amount of weeks elasped.
        uint minConfirmations = daysPassed / 7;

        // If the user confirmations count for an active day is less than the expected
        // deadline count on that day, missedWakeups is incremented by the difference
        numMissedDeadlines = 0;
        for (uint i; i < self.alarmDays.length; i++) {
            uint8 checkDay = self.alarmDays[i];
            uint expectedConfirmationsOnThisDay = minConfirmations;
            if (activationDay <= checkDay && checkDay <= lastDeadlineDay) {
                expectedConfirmationsOnThisDay++;
            }
            numMissedDeadlines +=
                expectedConfirmationsOnThisDay -
                uint(self.entries[checkDay - 1]);
        }
    }

    function nextDeadline(Schedule storage self) public view returns (uint256) {
        uint lastMidnight = _lastMidnightTimestamp(self);
        if (_deadlinePassedToday(self)) {
            return lastMidnight + 1 days + self.alarmTime;
        } else {
            return lastMidnight + self.alarmTime;
        }
    }

    function lastDeadline(Schedule storage self) public view returns (uint256) {
        uint lastMidnight = _lastMidnightTimestamp(self);
        if (_deadlinePassedToday(self)) {
            return lastMidnight + self.alarmTime;
        } else {
            return lastMidnight - 1 days + self.alarmTime;
        }
    }

    /*** Private/Internal Functions ***/

    function _deadlinePassedToday(
        Schedule storage self
    ) private view returns (bool) {
        uint _now = _offsetTimestamp(block.timestamp, self.timezoneOffset);
        return (_now % SECONDS_PER_DAY) > self.alarmTime;
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
        uint8 nextWakeupDay = _dayOfWeek(nextDeadline(self));
        for (uint i; i < self.alarmDays.length; i++) {
            if (self.alarmDays[i] == nextWakeupDay) {
                return true;
            }
        }
        return false;
    }

    // 1 = Monday, 7 = Sunday
    function _dayOfWeek(
        uint256 timestamp
    ) internal pure returns (uint8 dayOfWeek) {
        uint256 _days = timestamp / SECONDS_PER_DAY;
        dayOfWeek = uint8(((_days + 3) % 7) + 1);
    }

    function _daysPassed(
        uint256 fromTime,
        uint256 toTime
    ) internal pure returns (uint256) {
        if (toTime < fromTime) return 0;
        return (toTime - fromTime) / SECONDS_PER_DAY;
    }

    /**
     * @notice 'midnight' is timezone specific so we must offset the timestamp
     */
    function _lastMidnightTimestamp(
        Schedule storage self
    ) private view returns (uint) {
        uint _now = _offsetTimestamp(block.timestamp, self.timezoneOffset);
        return _now - (_now % SECONDS_PER_DAY);
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
