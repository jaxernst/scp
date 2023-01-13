// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * Types of schedules that commitments can utilize and track progress with
 */
enum ScheduleType {
    NONE,
    DEADLINE,
    DAY_OF_WEEK,
    INTERVAL
}