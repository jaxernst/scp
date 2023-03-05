import { derived, get, writable } from "svelte/store";

export const SelectionWheel = (items: number) => {
  const i = writable(0);

  return {
    subscribe: derived(i, ($i) => ({
      selected: $i,
      atEnd: $i === items - 1,
      atStart: $i === 0,
    })).subscribe,

    next: () => {
      if (get(i) === items - 1) return console.log("Return");
      i.set(get(i) + 1);
    },
    prev: () => {
      if (get(i) === 0) return console.log("return");
      i.set(get(i) - 1);
    },
  };
};
