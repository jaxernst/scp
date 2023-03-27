import { readContract } from "@wagmi/core";
import { derived, get, writable, type Readable } from "svelte/store";
import { commitmentHub } from "./contractInterface";
import { account } from "./chainClient";
import { commitmentTypeVals } from "@scp/protocol/lib/types";

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
  async ([$hub, $account]) => {
    if (!$account || !$hub) return;
    console.log(
      $hub.filters.CommitmentCreation(
        $account.address,
        commitmentTypeVals["PartnerAlarmClock"]
      )
    );
    const creationEvents = await $hub.queryFilter(
      $hub.filters.CommitmentCreation(
        $account.address,
        commitmentTypeVals["PartnerAlarmClock"]
      )
    );

    if (creationEvents.length === 0) {
      console.log("No creation events found");
      return undefined;
    }

    const lastCreationEvent = creationEvents[creationEvents.length - 1];
    return lastCreationEvent.args.commitmentAddr;
  }
) as Readable<Promise<string | undefined>>;

export const createGameOptions = SelectionWheel(4);
