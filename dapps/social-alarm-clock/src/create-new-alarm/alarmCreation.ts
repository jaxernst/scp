import { BigNumber } from "ethers";
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

export const buyIn = writable<number | null>(null);
export const timezoneMode = writable<TimezoneMode | null>(null);
export const alarmTime = writable<string | null>(null);

export const isReady = derived(
  [buyIn, timezoneMode, alarmTime, alarmDays],
  ([$buyIn, $timezoneMode, $alarmTime, $alarmDays]) => {
    return (
      $buyIn &&
      $timezoneMode &&
      $alarmTime &&
      Object.values($alarmDays).some((v) => v)
    );
  }
);
