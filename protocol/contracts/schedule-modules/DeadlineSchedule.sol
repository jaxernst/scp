// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library DeadlineSchedule {
    struct Schedule {
        // Init vars
        uint deadline;
        uint submissionWindow;
        // Schedule state vars
        bool submitted;
    }

    function init(Schedule storage self, uint deadline, uint submissionWindow) internal {
        require(block.timestamp < deadline, "INVALID_DEADLINE");
        self.deadline = deadline;
        self.submissionWindow = submissionWindow;
    }

    function entries(Schedule storage self) internal view returns (uint) {
        if (self.submitted) return 1;
        return 0;
    }

    function missedDeadlines(Schedule storage self) internal view returns (uint) {
        if (self.submitted) return 0;

        // Haven't received a submission
        if (block.timestamp < self.deadline) {
            // Deadline hasn't passed
            return 0;
        } 
        // Deadline has passed and no submission received
        return 1;
    }

    function inSubmissionWindow(Schedule storage self) internal view returns(bool) {
        return
            block.timestamp <= self.deadline &&
            block.timestamp >= self.deadline - self.submissionWindow;
    }

    function recordEntry(Schedule storage self) internal {
        require(!self.submitted, "ALREADY_SUBMITTED");
        require(inSubmissionWindow(self), "NOT_IN_SUBMISSION_WINDOW");
        self.submitted = true;
    }
}


