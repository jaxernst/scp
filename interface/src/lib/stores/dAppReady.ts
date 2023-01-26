import { derived, writable } from 'svelte/store';
import { connected, chainId, signer } from 'svelte-ethers-store';
import { getCommitmentHub } from '$lib/getContract';
import { supportedCommitmentTypes, ZERO_ADDRESS } from '$lib/constants';
import type { CommitmentHub } from '@scp/protocol/typechain-types';
import { commitmentTypeVals } from '@scp/protocol/lib/types';
import { SupportedChainId } from 'src/SupportedChainId';

/**
 * Stores to determine  whether the dApp is ready to be interacted with.
 * (Transactions are ready to be made with the protocol)
 *
 * Requirements:
 *  - Connection established with supported chain
 *  - Wallet has signed with private keys to verify ownership (ToDo)
 *  - CommitmentHub is available in stores
 *  - All supported commitment types are registered
 */

type ConnectionError =
	| 'Not Connected'
	| 'Wrong Chain'
	| 'No Commitment Hub Found'
	| 'Commitment Types Not Registered'
	| 'No Signer'

export const connectionError = writable<ConnectionError | null>(null);

export const dAppReady = derived(
	[chainId, connected, signer], 
	([$chainId, $connected, $signer], set) => {
		if (!$connected) {
			connectionError.set('Not Connected');
			return set(false);
		}

		if (!Object.values(SupportedChainId).includes($chainId)) {
			connectionError.set('Wrong Chain');
			return set(false);
		}

		if (!$signer) {
			connectionError.set("No Signer")
			return set(false)
		}

		// Get SCP Hub
		const hub = getCommitmentHub();
		if (!hub) {
			connectionError.set('No Commitment Hub Found');
			return set(false);
		}

		supportedCommitmentsRegistered(hub)
			.then((typesRegistered) => {
				if (!typesRegistered) {
					connectionError.set('Commitment Types Not Registered');
					return set(false);
				}
				connectionError.set(null)
				set(true);
			})
			.catch(() => set(false));
});

async function supportedCommitmentsRegistered(hub: CommitmentHub) {
	for (let type of supportedCommitmentTypes) {
		if ((await hub.commitmentRegistry(commitmentTypeVals[type])) === ZERO_ADDRESS) {
			return false;
		}
	}
	return true;
}
