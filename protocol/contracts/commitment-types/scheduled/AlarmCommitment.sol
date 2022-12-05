// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../../BaseCommitment.sol";

/**
 * An AlarmCommitment is a commitment that expects confirmations to be submitted
 * before a specified time on specified days of the week, similar to how an alarm
 * clock would be set.
 * 
 * Confirmations can be submitted if the next wakeup is close enough, (within a
 * specific window), and confirmations cannot be submitted if this window is 
 * missed.
 * 
 * The number of missed alarms can always be calulcated and used by enforcement
 * modules to penalize the commitment owner.
 */
contract AlarmCommitment is BaseCommitment {
    uint SECONDS_PER_DAY = 1 days;
    
    // Init vars
    uint8[] public activeDays;
    uint public alarmTime;
    int public timezoneOffset;
    
    uint32[7] confirmationCountArr;
    uint256 activationTime;
    uint submissionWindowDuration;

    function __init__AlarmCommitment(
        bytes memory _data
    ) public initializer returns(bool) {
    }

    function submitConfirmation() public virtual override onlyOwner {

    }

    /*
     * Temporarily disable alarm clock. Users cannot be penalized for missed wakeups
     * when their alarm is not on.
     */
    function pause() public onlyOwner {
        require(status == Status.Active, "Alarm not active");
        require(
            _deactivationAllowed(),
            "Forbidden, user too close to wakeup or has unpenalized missed wakeups"
        );
        status = Status.Paused;
        emit StatusChanged(Status.Active, Status.Paused);
    }

    /**
     * Continue enforcing wakeups on the days orignally set by the user
     * @notice resuming alarm sets a new activation time as the previous wakeup,
     * so the next wakeup will be enforceable
     */
    function resumeAlarm() public {
        require(status == Status.Paused, "Alarm already active");

        // Reset alarm vars used to track missed wakeups/penalties
        //userAlarms[msg.sender].wakeCountArr = new uint32[](7);
        //userAlarms[msg.sender].activationTime = lastWakeupTimestamp(msg.sender);
        //userAlarms[msg.sender].on = true;
    }

    /**
     * Return the user's staked funds and delete their record from the pool
     */
    /* function exitPool() public {
        require(
            userAlarms[msg.sender].activationTime != 0,
            "User has not joined the pool"
        );
        require(
            _deactivationAllowed(msg.sender),
            "Forbidden, user too close to wakeup or has unpenalized missed wakeups"
        );

        // Delete user record prior to transferring to protect again reentrancy attacks
        delete userAlarms[msg.sender];
        payable(msg.sender).transfer(userAlarms[msg.sender].amountStaked);
        hub.recordUserExit(msg.sender);
    } */


    function totalConfirmations()
        external
        view
        returns (uint confirmations)
    {
        confirmations = 0;
        for (uint i; i < activeDays.length; i++) {
            confirmations += confirmationCountArr[activeDays[i]];
        }
    }

    /**
     * Determine how many total alarm deadlines have been missed by the owner.
     * @notice missed wakeups is a function of the alarm activation time,
     * the alarm active days, the last wakeup time, an the user's timezone:
     * missedWakeups = f(activationTime, alarmDays, lastalarmTime, timezoneOffset)
     */
    function missedDeadlines()
        public
        view
        override
        returns (uint numMissedDeadlines)
    {
        uint256 daysPassed = _daysPassed(
            activationTime,
            block.timestamp
        );

        // The current day of week is taken from the last deadline time (timezone adjusted)
        uint256 lastDeadlineDay = _dayOfWeek(lastDeadlineTimestamp());

        uint8 activationDay = _dayOfWeek(activationTime);

        // The expected amount of confirmations for any given alarm day is at least
        // the amount of weeks elasped.
        uint minConfirmations = daysPassed / 7;

        // If the user confirmations count for an active day is less than the expected
        // deadline count on that day, missedWakeups is incremented by the difference
        numMissedDeadlines = 0;
        for (uint i; i < activeDays.length; i++) {
            uint8 checkDay = activeDays[i];
            uint expectedConfirmationsOnThisDay = minConfirmations;
            if (activationDay <= checkDay && checkDay <= lastDeadlineDay) {
                expectedConfirmationsOnThisDay++;
            }
            numMissedDeadlines +=
                expectedConfirmationsOnThisDay -
                uint(confirmationCountArr[checkDay - 1]);
        }
    }

    function nextDeadlineTimestamp() public view returns (uint256) {
        uint lastMidnight = _lastMidnightTimestamp();
        if (_deadlinePassedToday()) {
            return lastMidnight + 1 days + alarmTime;
        } else {
            return lastMidnight + alarmTime;
        }
    }

    function lastDeadlineTimestamp() public view returns (uint256) {
        uint lastMidnight = _lastMidnightTimestamp();
        if (_deadlinePassedToday()) {
            return lastMidnight + alarmTime;
        } else {
            return lastMidnight - 1 days + alarmTime;
        }
    }

    /*** Private/Internal Functions ***/

    function _deadlinePassedToday() private view returns (bool) {
        uint _now = _offsetTimestamp(
            block.timestamp,
            timezoneOffset
        );
        return (_now % SECONDS_PER_DAY) > alarmTime;
    }

    function _inSubmissionWindow() private view returns (bool) {
        if (_deadlinePassedToday()) return false;
        return
            (nextDeadlineTimestamp() - block.timestamp) <
            submissionWindowDuration;
    }

    /**
     * Deactivations are not allowed if the next wakeup day is included in the user's
     * alarm, and the current time is within x hours before the next wakeup time.
     * (adjusted for the user's timezone)
     */
    function _deactivationAllowed() internal view returns (bool) {
        return
            this.missedDeadlines() == 0 &&
            _enforceNextWakeup() &&
            !_inSubmissionWindow();
    }

    function _enforceNextWakeup() internal view returns (bool) {
        // If the day of the commitment's next deadline is in the activeOnDays array, 
        // return true
        uint8 nextWakeupDay = _dayOfWeek(nextDeadlineTimestamp());
        for (uint i; i < activeDays.length; i++) {
            if (activeDays[i] == nextWakeupDay) {
                return true;
            }
        }
        return false;
    }

    // 1 = Monday, 7 = Sunday
    function _dayOfWeek(uint256 timestamp)
        internal
        view
        returns (uint8 dayOfWeek)
    {
        uint256 _days = timestamp / SECONDS_PER_DAY;
        dayOfWeek = uint8(((_days + 3) % 7) + 1);
    }

    function _daysPassed(uint256 fromTime, uint256 toTime)
        internal
        view
        returns (uint256)
    {
        if (toTime < fromTime) return 0;
        return (toTime - fromTime) / SECONDS_PER_DAY;
    }

    /**
     * @notice 'midnight' is timezone specific so we must offset the timestamp
     */
    function _lastMidnightTimestamp() private view returns (uint) {
        uint _now = _offsetTimestamp(
            block.timestamp,
            timezoneOffset
        );
        return _now - (_now % SECONDS_PER_DAY);
    }

    function _offsetTimestamp(uint timestamp, int offset)
        internal
        pure
        returns (uint256)
    {
        return uint(int(timestamp) + offset);
    }

    function _validateDaysArr(uint8[] memory daysActive)
        internal
        pure
        returns (bool)
    {
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
