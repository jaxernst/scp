import type { BigNumber, BigNumberish, ContractTransaction } from "ethers";
import { BigNumber as bn } from "ethers";
import CommitmentHubAbi from "@scp/sdk/abi/CommitmentHub.json";
import { parseEther } from "ethers/lib/utils.js";
import { derived, get, writable, type Readable } from "svelte/store";
import { account } from "../lib/chainClient";
import { CommitmentHubAddress, commitmentHub } from "../lib/contractInterface";
import { prepareWriteContract } from "@wagmi/core";
import { encodeCreationParams } from "@scp/sdk/src/scp-helpers";
import { commitmentTypeVals } from "@scp/protocol/lib/types";
import { transactions } from "../lib/transactions";

export const SelectionWheel = (numItems: number) => {
  const i = writable(0); // Selected index
  return {
    subscribe: derived(i, ($i) => ({
      selected: $i,
      atEnd: $i === numItems - 1,
      atStart: $i === 0,
    })).subscribe,

    next: () => {
      if (get(i) === numItems - 1) return;
      i.set(get(i) + 1);
    },
    prev: () => {
      if (get(i) === 0) return;
      i.set(get(i) - 1);
    },
  };
};

type Days = "M" | "T" | "W" | "Th" | "F" | "Sa" | "Su";

type ActiveDays = {
  [key in Days]: boolean;
};

export enum TimezoneMode {
  SAME_ABSOLUTE_TIME,
  SAME_TIME_OF_DAY,
}

export const alarmDays = writable({
  Su: false,
  M: false,
  T: false,
  W: false,
  Th: false,
  F: false,
  Sa: false,
});

type CreationParams = {
  buyIn: BigNumberish;
  submissionWindow: number;
  timezoneMode: TimezoneMode;
  alarmTime: number;
  alarmDays: number[];
  otherPlayer: string;
  missedAlarmPenalty: BigNumberish;
};

export const buyIn = writable<number>(0.001);
export const timezoneMode = writable<TimezoneMode>(
  TimezoneMode.SAME_TIME_OF_DAY
);
export const alarmTime = writable<string>("06:30");
export const submissionWindow = writable<number>(60 * 30);
export const missedAlarmPenalty = writable(parseEther(".01"));
export const otherPlayer = writable<string>(
  "0x9B8DB9bffcCd1F2Cc5044d67a1b9C68dD6Deff6a"
);

export const creationParams = writable<CreationParams>({
  buyIn: "",
  submissionWindow: 60 * 30,
  timezoneMode: TimezoneMode.SAME_TIME_OF_DAY,
  alarmTime: 0, // 6:30 AM
  alarmDays: [],
  otherPlayer: "",
  missedAlarmPenalty: "0",
});

export const isReady = derived(
  [creationParams, account],
  ([
    { submissionWindow, otherPlayer, buyIn, timezoneMode, alarmTime },
    $account,
  ]) => {
    console.log({
      submissionWindow,
      otherPlayer,
      buyIn,
      timezoneMode,
      alarmTime,
    });
    return (
      submissionWindow > 0 &&
      otherPlayer !== $account?.address &&
      buyIn &&
      bn.from(buyIn).gt(0) &&
      timezoneMode !== null &&
      alarmTime !== null &&
      Object.values(alarmDays).some((v) => v)
    );
  }
);

export const createAlarm = derived(
  [creationParams, isReady, commitmentHub],
  ([c, $isReady, $commitmentHub]) => {
    return () => {
      if (!$isReady) return;

      // Enode creation params to be sent to the commitment hub
      const encodedParams = encodeCreationParams("PartnerAlarmClock", {
        alarmTime: c.alarmTime,
        alarmdays: c.alarmDays.sort(),
        missedAlarmPenalty: c.missedAlarmPenalty,
        submissionWindow: c.submissionWindow,
        timezoneOffset: new Date().getTimezoneOffset() * -60,
        otherPlayer: c.otherPlayer,
      });

      return $commitmentHub.createCommitment(
        commitmentTypeVals["PartnerAlarmClock"],
        encodedParams,
        { value: c.buyIn }
      );
    };
  }
) as Readable<() => Promise<ContractTransaction> | undefined>;
