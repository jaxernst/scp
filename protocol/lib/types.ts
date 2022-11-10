import { string } from "hardhat/internal/core/params/argumentTypes";
import { StandardCommitment, StandardCommitment__factory } from "../typechain-types";

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type CommitTypeVals = 0 | 1 | 2

export enum CommitType {
    STANDARD,
    DEADLINE,
    ALARM
}

export type CommitContractTypes = {
    0: StandardCommitment,
    1: StandardCommitment,
    2: StandardCommitment
}

export const CommiFactoryMapping = {
    0: StandardCommitment__factory,
    1: StandardCommitment__factory,
    2: StandardCommitment__factory
}

export const CommitContractNames = {
    0: "StandardCommitment",
    1: "DeadlineCommitment",
    2: "AlarmCommitment"
}

export type CommitInitDataTypes = {
    0: [string, string],
    1: [string, number],
    2: [string, DayOfWeek[]]
}

export const SolidityCommitInitTypes = {
    0: ["string", "string"],
    1: ["string", "uint256"],
    2: ["string", "string"]
}

export enum CommitStatus {
    ACTIVE,
    COMPLETE,
    TERMINATED,
    PAUSED
}
