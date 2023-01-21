import { BigNumberish, ContractFactory } from "ethers";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { BaseCommitment, Commitment__factory, TimelockingDeadlineTask, TimelockingDeadlineTask__factory} from "../typechain-types";

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

export const commitmentTypeVals: Record<CommitmentContractName, number> = {
    BaseCommitment: 0,
    TimelockingDeadlineTask: 1
}

export type CommitmentContractName = 
    "BaseCommitment" | 
    "TimelockingDeadlineTask" 

export type CommitmentContractTypes = {
    "BaseCommitment": BaseCommitment,
    "TimelockingDeadlineTask": TimelockingDeadlineTask
}

export const commitmentFactories = {
    "BaseCommitment": Commitment__factory,
    "TimelockingDeadlineTask": TimelockingDeadlineTask__factory
}

export type InitializationTypes = {
    "BaseCommitment": { name: string, description: string}
    "TimelockingDeadlineTask": { 
        deadline: BigNumberish, 
        submissionWindow: BigNumberish,
        timelockDuration: BigNumberish,
        taskDescription: BigNumberish
    }
}

export const solidityInitializationTypes = {
    "BaseCommitment": ["string", "string"],
    "TimelockingDeadlineTask": ["uint256", "uint256", "string", "string"],
}

export enum CommitStatus {
    ACTIVE,
    PAUSED,
    COMPLETE,
    CANCELLED,
}

export enum ScheduleModules {
    NONE,
    DEADLINE,
    ALARM,
    INTERVAL
}

export enum PenaltyModules {
    TIMELOCK,
    DONATION
}


