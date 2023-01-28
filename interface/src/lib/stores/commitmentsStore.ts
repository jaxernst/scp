import { 
    getCommitmentHub, 
    getUserCommitments as _getUserCommitments, 
    type UserCommitment,  
} from "$lib/commitments";
import { CommitStatus } from "@scp/protocol/lib/types";
import type { CommitmentHub } from "@scp/protocol/typechain-types";
import type { TypedEvent } from "@scp/protocol/typechain-types/common";
import type { ContractReceipt, ContractTransaction, Signer } from "ethers";

import { derived, get, writable, type Subscriber, type Writable } from "svelte/store";



export const transactions = writable<(ContractTransaction)[]>([])




interface UserCommitmentStore {
    commitments: UserCommitment[],
    txs: (ContractTransaction)[]
    rcs: (ContractReceipt)[]
}

function MakeUserCommitmentStore() {
    const store =  writable<UserCommitmentStore>({
        commitments: [],
        txs: [],
        rcs: [],
    })
    const { subscribe, set, update } = store
    
    let hubCache: CommitmentHub
    let signerCache: Signer
    let fetched = false
    const fetchCommitments = async (hub: CommitmentHub, signer: Signer) => {
        if (!hub || !signer) return []

        hubCache = hub
        signerCache = signer

        if (fetched) return get(store).commitments

        console.log("Querying")
        const result = await _getUserCommitments(hub, signer)
        fetched = true
        update($data => {
            // This should eventually be replaced with a map structure indexing with
            // commitment ids
            if (result) $data.commitments = result
            return $data
        })
        return result ?? []
    }

    // Fetch again when transactions is updated
    transactions.subscribe(async (tx) => {        
        fetched = false

        fetchCommitments(hubCache, signerCache)
    })

    async function addTx(_tx: Promise<ContractTransaction>) {
        const tx = await _tx
        update($data => ({...$data, txs: [...$data.txs, tx]}))
        const rc = await tx.wait()
        update($data => ({...$data, rcs: [...$data.rcs, rc]}))
        console.log("Tx complete")
        // Temp
        fetched = false
        fetchCommitments(hubCache, signerCache)
    }
    
    return {
        subscribe,
        fetchCommitments,
        addTx
    }       
}

export const scpUser = MakeUserCommitmentStore()