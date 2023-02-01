import { MakeUserCommitmentStore } from "@scp/svelte-scp-store"
import { contracts, signer } from "svelte-ethers-store"

export const scpUser = MakeUserCommitmentStore(contracts, signer)