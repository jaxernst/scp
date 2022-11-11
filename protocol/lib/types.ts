import { BigNumberish } from "ethers";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { BaseCommitment, BaseCommitment__factory, Commitment, Commitment__factory, DeadlineCommitment, DeadlineCommitment__factory, StandardCommitment, StandardCommitment__factory } from "../typechain-types";

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type CommitTypeVals = 0 | 1 | 2

export enum CommitType {
    BASE,
    DEADLINE,
    INTERVAL
}

export type CommitContractTypes = {
    0: BaseCommitment,
    1: DeadlineCommitment,
    2: Commitment,
}

export const CommitFactoryMapping = {
    0: BaseCommitment__factory,
    1: DeadlineCommitment__factory,
    2: Commitment__factory
}

export const CommitContractNames = {
    0: "BaseCommitment",
    1: "DeadlineCommitment",
    2: "AlarmCommitment"
}

export type CommitInitDataTypes = {
    0: [string],
    1: [string, BigNumberish, BigNumberish],
    2: [string, string, DayOfWeek[]]
}

export const SolidityCommitInitTypes = {
    0: ["string"],
    1: ["string", "uint256", "uint256"],
    2: ["string", "string"]
}

export enum CommitStatus {
    ACTIVE,
    COMPLETE,
    TERMINATED,
    PAUSED
}
