import { BigNumberish } from "ethers";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { AlarmCommitment, AlarmCommitment__factory, BaseCommitment, BaseCommitment__factory, DeadlineCommitment, DeadlineCommitment__factory } from "../typechain-types";

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type CommitTypeVals = 0 | 1 | 2

export enum CommitType {
    BASE,
    DEADLINE,
    ALARM
}

export enum CommitStatus {
    ACTIVE,
    PAUSED,
    COMPLETE,
    CANCELLED,
}


export enum ScheduleType {
    NONE,
    DEADLINE,
    ALARM
}

export type CommitContractTypes = {
    0: BaseCommitment,
    1: DeadlineCommitment,
    2: AlarmCommitment
}

export const CommitFactoryMapping = {
    0: BaseCommitment__factory,
    1: DeadlineCommitment__factory,
    2: AlarmCommitment__factory
}

export const CommitContractNames = {
    0: "BaseCommitment",
    1: "DeadlineCommitment",
    2: "AlarmCommitment"
}

export type InitializationTypes = {
    0: { name: string, description: string}
    1: { 
        deadline: BigNumberish, 
        submissionWindow: BigNumberish
        name: string, 
        description: string, 
    },
    2: {
        alarmTime: BigNumberish,
        submissionWindow: BigNumberish,
        timezoneOffset: BigNumberish,
        daysActive: DayOfWeek[]
    }
}

export const SolidityCommitInitTypes = {
    0: ["string", "string"],
    1: ["uint256", "uint256", "string", "string"],
    2: ["uint256", "uint256", "int", "uint8[]"]
}

