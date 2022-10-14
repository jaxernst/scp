
import { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';

export const modal = writable(SvelteComponent);
export const windowStyle = writable({});