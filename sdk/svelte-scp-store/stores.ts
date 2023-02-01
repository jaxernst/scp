import { ContractReceipt, ContractTransaction, Signer } from "ethers";
import { derived, get, writable } from "svelte/store";
import type {
  contracts as ContractsStore,
  signer as SignerStore
} from "svelte-ethers-store";
import { getUserCommitments, type UserCommitment } from "../src/scp-helpers";

import type { CommitmentHub } from "@scp/protocol/typechain-types";

export interface UserCommitmentStore {
  commitments: UserCommitment[];
  txs: ContractTransaction[];
  rcs: ContractReceipt[];
}

export function MakeUserCommitmentStore(contracts: typeof ContractsStore, signer: typeof SignerStore) {
  /**
   * Store definitions
   */
  const txs = writable<ContractTransaction[]>([]);
  const rcs = writable<ContractReceipt[]>([]);
  const commitments = writable<Record<number, UserCommitment>>({});
  const cph = derived(contracts, $contracts => $contracts["CommitmentHub"] as unknown as CommitmentHub )

  /**
   * Store operations/functions
   */
  const fetchCommitments = async (
    _hub?: CommitmentHub,
    _signer?: Signer
  ): Promise<Record<number, UserCommitment>> => {
    _signer = _signer ?? get(signer);
    _hub = _hub ?? get(cph)

    if (!_hub || !_signer) return {};

    console.log("Querying");
    const result = await getUserCommitments(_hub, _signer);

    if (result) {
      console.log("Updating commitments")
      commitments.set(result);
    }

    return result ?? {};
  };

  const addTx = async (_tx: Promise<ContractTransaction>) => {
    const tx = await _tx;
    txs.update(($txs) => [...$txs, tx]);
    const rc = await tx.wait();
    rcs.update(($rcs) => [...$rcs, rc]);
    console.log("rcs updated");

    // Temp
    fetchCommitments();
  };

  return {
    // The primary store data is derived from the following stores: txs, rcs, commitments
    subscribe: derived(
      [txs, rcs, commitments],
      ([$txs, $rcs, $commitments]) => {
        console.log("Updating main store")
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

