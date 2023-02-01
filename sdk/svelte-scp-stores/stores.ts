import { ContractReceipt, ContractTransaction, Signer } from "ethers";
import { derived, get, writable } from "svelte/store";
import { contracts, signer, signerAddress } from "svelte-ethers-store";
import { getUserCommitments, type UserCommitment } from "../src/scp-helpers";

import type { CommitmentHub } from "@scp/protocol/typechain-types";

export const cph = derived<typeof contracts, CommitmentHub | null>(
  contracts,
  ($contracts) => {
    return $contracts.ProtocolHub as unknown as CommitmentHub;
  }
);

export interface UserCommitmentStore {
  commitments: UserCommitment[];
  txs: ContractTransaction[];
  rcs: ContractReceipt[];
}

function MakeUserCommitmentStore(autoFetch: boolean = true) {
  /**
   * Store definitions
   */
  const txs = writable<ContractTransaction[]>([]);
  const rcs = writable<ContractReceipt[]>([]);
  const commitments = writable<Map<number, UserCommitment>>(new Map());

  const fetchReady = derived(
    [contracts, signer, signerAddress],
    ([$contracts, $signer, $signerAddress]) => {
      return $contracts["CommitmentHub"] && $signer && $signerAddress;
    }
  );

  /**
   * Closure vars
   */
  let fetched = false;
  let storedSigner: Signer | undefined;
  let storedCommitmentHub: CommitmentHub | undefined;

  /**
   * Store's subscriptions / updaters
   */
  signer.subscribe(($signer) => {
    if (!($signer && get(signerAddress))) return;
    storedSigner = $signer;
  });

  contracts.subscribe(($contracts) => {
    if (!$contracts["CommitmentHub"]) return;
    storedCommitmentHub = $contracts["CommitmentHub"] as CommitmentHub;
  });

  fetchReady.subscribe(($fetchReady) => {
    if (fetchReady && storedSigner && storedCommitmentHub) {
      fetchCommitments(storedCommitmentHub, storedSigner);
    }
  });

  /**
   * Store operations/functions
   */
  const fetchCommitments = async (hub?: CommitmentHub, signer?: Signer) => {
    hub = hub ?? storedCommitmentHub
    signer = signer ?? storedSigner
    if (!hub || !signer) return [];
    if (fetched) return get(commitments);

    console.log("Querying");
    const result = await getUserCommitments(hub, signer);
    if (!result) return [];

    commitments.update(($commitments) => result);
    return result ?? [];
  };

  const addTx = async (_tx: Promise<ContractTransaction>) => {
    const tx = await _tx;
    txs.update(($txs) => [...$txs, tx]);
    const rc = await tx.wait();
    rcs.update(($rcs) => [...$rcs, rc]);

    // Temp
    fetchCommitments();
  };

  return {
    // The primary store data is derived from the following stores: txs, rcs, commitments
    subscribe: derived(
      [txs, rcs, commitments],
      ([$txs, $rcs, $commitments]) => {
        return {
          commitments: $commitments,
          txs: $txs,
          rcs: $rcs,
        };
      }
    ).subscribe,
    fetchCommitments,
    startListener: () => {}, // Not implemented
    addTx,
  };
}

export const scpUser = MakeUserCommitmentStore();
