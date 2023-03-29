import { readContract } from "@wagmi/core";
import { derived, get, writable, type Readable } from "svelte/store";
import { commitmentHub } from "./contractInterface";
import { account } from "./chainClient";
import { CommitStatus, commitmentTypeVals } from "@scp/protocol/lib/types";
import {
  getCommitment,
  getUserCommitments,
  queryCommitmentCreationEvents,
} from "@scp/sdk/src/scp-helpers";
import type {
  CommitmentHub,
  PartnerAlarmClock,
} from "@scp/protocol/typechain-types";
import { getAlarm } from "./getAlarm";

enum View {
  CONNECT_WALLET,
  NO_ACTIVE_GAME,
  CREATE_ALARM,
  JOIN_ALARM,
  ALARM_ACTIVE,
}

const SelectionWheel = (items: number) => {
  const selected = writable(0);

  return {
    subscribe: derived(selected, (s) => ({
      selected: s,
      atEnd: s === items - 1,
      atStart: s === 0,
    })).subscribe,

    next: () => {
      if (get(selected) === items - 1) return;
      selected.set(get(selected) + 1);
    },
    prev: () => {
      if (get(selected) === 0) return;
      selected.set(get(selected) - 1);
    },
  };
};

export const createGameOptions = SelectionWheel(4);

export const userAlarm = derived(
  [commitmentHub, account],
  ([$hub, $account], set) => {
    if (!$hub || !$hub.provider || !$account) return set(undefined);

    getAlarm($hub, $account.address)
      .then((result) => set(result))
      .catch((err) => {
        console.error(err);
        set(undefined);
      });
  },
  undefined
) as Readable<PartnerAlarmClock | undefined>;

export const userAlarmActive = derived([userAlarm], ([$alarm], set) => {
  if (!$alarm) return set(false);
  console.log($alarm);
  $alarm.status().then((status) => {
    set(status === CommitStatus.ACTIVE);
    console.log(status);
  });
});
