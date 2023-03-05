import { derived, get, writable } from "svelte/store";

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

export const createGameOptions = SelectionWheel(4);
export const gameActive = writable(false);
