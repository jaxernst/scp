import { BigNumberish, ContractFactory } from "ethers";
import { string } from "hardhat/internal/core/params/argumentTypes";
import {
  BaseCommitment,
  PartnerAlarmClock,
  PartnerAlarmClock__factory,
  TimelockingDeadlineTask,
} from "../typechain-types";
import {
  BaseCommitment__factory,
  TimelockingDeadlineTask__factory,
} from "../typechain-types";
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const commitmentTypeVals: Record<CommitmentType, number> = {
  BaseCommitment: 0,
  TimelockingDeadlineTask: 1,
  PartnerAlarmClock: 2,
};

export const commitmentValToType: Record<number, CommitmentType> = {
  0: "BaseCommitment",
  1: "TimelockingDeadlineTask",
};

export type CommitmentType =
  | "BaseCommitment"
  | "TimelockingDeadlineTask"
  | "PartnerAlarmClock";

export type CommitmentContractTypes = {
  BaseCommitment: BaseCommitment;
  TimelockingDeadlineTask: TimelockingDeadlineTask;
  PartnerAlarmClock: PartnerAlarmClock;
};

export const commitmentFactories = {
  BaseCommitment: BaseCommitment__factory,
  TimelockingDeadlineTask: TimelockingDeadlineTask__factory,
  PartnerAlarmClock: PartnerAlarmClock__factory,
};

export type InitializationTypes = {
  BaseCommitment: { name: string; description: string };
  TimelockingDeadlineTask: {
    deadline: BigNumberish;
    submissionWindow: BigNumberish;
    timelockDuration: BigNumberish;
    taskDescription: BigNumberish;
  };
  PartnerAlarmClock: {
    alarmTime: BigNumberish;
    alarmdays: BigNumberish;
    submissionWindow: BigNumberish;
    missedAlarmPenalty: BigNumberish;
    timezoneOffset: BigNumberish;
    otherPlayer: string;
  };
};

export const solidityInitializationTypes = {
  BaseCommitment: ["string", "string"],
  TimelockingDeadlineTask: ["uint256", "uint256", "string", "string"],
  PartnerAlarmClock: [
    "uint256",
    "uint8[]",
    "uint256",
    "uint256",
    "int256",
    "address",
  ],
};

export enum CommitStatus {
  INACTIVE,
  ACTIVE,
  PAUSED,
  COMPLETE,
  CANCELLED,
}

export enum ScheduleModules {
  NONE,
  DEADLINE,
  ALARM,
  INTERVAL,
}

export enum PenaltyModules {
  TIMELOCK,
  DONATION,
}
