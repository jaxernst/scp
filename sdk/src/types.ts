import { BigNumber } from "ethers";

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type CommitmentConstants = {
  PartnerAlarmClock: {
    submissionWindow: BigNumber;
    missedAlarmPenalty: BigNumber;
    alarmDays: DayOfWeek[];
    alarmTime: BigNumber;
  };
};
