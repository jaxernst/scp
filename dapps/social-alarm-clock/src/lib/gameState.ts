import { readContract } from "@wagmi/core";
import { derived, get, writable, type Readable } from "svelte/store";
import { commitmentHub } from "./contractInterface";
import { account } from "./chainClient";
import { commitmentTypeVals } from "@scp/protocol/lib/types";
import {
  getUserCommitments,
  queryCommitmentCreationEvents,
} from "@scp/sdk/src/scp-helpers";

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
      if (get(selected) === items - 1) return console.log("Return");
      selected.set(get(selected) + 1);
    },
    prev: () => {
      if (get(selected) === 0) return console.log("return");
      selected.set(get(selected) - 1);
    },
  };
};

export const activeGame = derived(
  [commitmentHub, account],
  ([$hub, $account], set) => {
    console.log("drived", $hub, $account);
    if (!$hub || !$hub.provider || !$account) return;

    queryCommitmentCreationEvents($hub, $account.address, "PartnerAlarmClock")
      .then((events) => {
        console.log("Read events", events);
        if (events.length === 0) return set(undefined);
        set(events[events.length - 1].args.commitmentAddr);
      })
      .catch((e) => console.log(e));
  }
) as Readable<string | undefined>;

export const createGameOptions = SelectionWheel(4);
