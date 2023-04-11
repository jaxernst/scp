import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { derived, get, writable } from "svelte/store";

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
  M: false,
  T: false,
  W: false,
  Th: false,
  F: false,
  Sa: false,
  Su: false,
});

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

export const isReady = derived(
  [buyIn, timezoneMode, alarmTime, alarmDays],
  ([$buyIn, $timezoneMode, $alarmTime, $alarmDays]) => {
    return (
      $buyIn &&
      $buyIn > 0 &&
      $timezoneMode !== null &&
      $alarmTime !== null &&
      Object.values($alarmDays).some((v) => v)
    );
  }
);
