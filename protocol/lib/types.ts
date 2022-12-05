import { BigNumberish } from "ethers";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { BaseCommitment, BaseCommitment__factory, DeadlineCommitment, DeadlineCommitment__factory } from "../typechain-types";

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type CommitTypeVals = 0 | 1

export enum CommitType {
    BASE,
    DEADLINE
}

export enum ScheduleType {
    NONE,
    DEADLINE,
    DAY_OF_WEEK
}

export type CommitContractTypes = {
    0: BaseCommitment,
    1: DeadlineCommitment
}

export const CommitFactoryMapping = {
    0: BaseCommitment__factory,
    1: DeadlineCommitment__factory
}

export const CommitContractNames = {
    0: "BaseCommitment",
    1: "DeadlineCommitment"
}

export type InitializationTypes = {
    0: { name: string, description: string}
    1: { 
        deadline: BigNumberish, 
        submissionWindow: BigNumberish
        name: string, 
        description: string, 
    }
}

export type CommitInitDataTypes = {
    0: [string, string],
    1: [BigNumberish, BigNumberish, string, string]
}

export const SolidityCommitInitTypes = {
    0: ["string", "string"],
    1: ["uint256", "uint256", "string", "string"],
}

export enum CommitStatus {
    ACTIVE,
    PAUSED,
    COMPLETE,
    CANCELLED,
}
