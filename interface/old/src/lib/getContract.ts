import type { AlarmPool, CommitmentProtocolHub } from "@social-alarm-clock/protocol/typechain-types";
import alarmPool from "@social-alarm-clock/protocol/artifacts/contracts/AlarmPool.sol/AlarmPool.json"

import { ethers, type Contract } from "ethers";
import { contracts } from "svelte-ethers-store"
import { get } from "svelte/store";


export function getComittmentProtocolHub(): CommitmentProtocolHub | undefined {
    const contract = get(contracts)["CommitmentProtocolHub"]
    if (!contract) return
    return contract as unknown as CommitmentProtocolHub
}

export async function getPool(hub: CommitmentProtocolHub, poolId: number): Promise<AlarmPool> {
    const addr = await hub.deployedPools(poolId)
    if (!addr) throw Error('Pool not found')

    return new ethers.Contract(
        addr, 
        alarmPool.abi
    ) as unknown as AlarmPool
}