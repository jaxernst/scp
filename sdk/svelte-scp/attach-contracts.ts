import { chainId, connected, defaultEvmStores } from "svelte-ethers-store"


function attachScpContracts() {
    if (!connected) return
    if (!chainId) console.warn("No chain found")

    const hubAddrs = require("../hub-deployments.json")

}