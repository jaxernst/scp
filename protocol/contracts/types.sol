// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * Enumeration of the commitment types registered through the commitment hub
 */
enum RegisteredCommitmentType {
    BASE,
    DEADLINE
}

/**
 * Types of schedules that commitments can utilize and track progress with
 */
enum ScheduleType {
    NONE,
    DEADLINE,
    ALARM,
    INTERVAL
}

/**
 * Status represents all the states that commitments can be in
 */
enum Status {
    ACTIVE,
    PAUSED,
    COMPLETE,
    CONTESTED,
    CANCELLED
}