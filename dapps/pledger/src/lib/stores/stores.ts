import type { CommitmentHub } from '@scp/protocol/typechain-types';
import { derived, writable } from 'svelte/store';
import { contracts } from 'svelte-ethers-store';

export const modal = writable<null | any>(null);
export const windowStyle = writable({});
export const cph = derived<typeof contracts, CommitmentHub | null>(contracts, ($contracts) => {
	return $contracts["CommitmentHub"] as unknown as CommitmentHub;
});
