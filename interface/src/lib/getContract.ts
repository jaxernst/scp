import type { CommitmentHub } from "@scp/protocol/typechain-types"
import { ethers, type Contract } from "ethers";
import { contracts } from "svelte-ethers-store"
import { get } from "svelte/store";


export function getCommitmentHub(): CommitmentHub | undefined {
    const contract = get(contracts)["CommitmentProtocolHub"]
    if (!contract) return
    return contract as unknown as CommitmentHub
}

export async function getCommitmnet(hub: CommitmentHub, poolId: number): Promise<Commitment> {
    const addr = await hub.deployedPools(poolId)
    if (!addr) throw Error('Pool not found')

    return new ethers.Contract(
        addr, 
        alarmPool.abi
    ) as unknown as AlarmPool
}