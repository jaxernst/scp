import { writable } from 'svelte/store';

export const modal = writable<null | any>(null);
export const windowStyle = writable({});
export const txs = writable(Array())