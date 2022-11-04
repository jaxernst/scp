import { getComittmentProtocolHub } from "./getContract";

export async function getUserPools(address: string) {
    await new Promise(r => setTimeout(r, 3000))
    const hub = getComittmentProtocolHub()
    if (!hub) return

    const joinEvents = await hub.queryFilter(
        hub.filters.JoinPool(address)
    )

    const exitEvents = await hub.queryFilter(
        hub.filters.ExitPool(address)
    )

    // Sort events in the order they were emitted
    const sortedEvents = [...joinEvents, ...exitEvents].sort((a, b) => {
        if (a.blockNumber != b.blockNumber) {
            return a.blockNumber - b.blockNumber
        }
        return a.transactionIndex - b.transactionIndex
    })

    const activePools = []
    for (let event of sortedEvents) {
        console.log(event)
    }
    return 
    
}