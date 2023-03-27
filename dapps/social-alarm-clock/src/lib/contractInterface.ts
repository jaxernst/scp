import { ethers } from "ethers";
import CommitmentHubAbi from "@scp/sdk/abi/CommitmentHub.json";
import { signer } from "./chainClient";
import { derived, get } from "svelte/store";
import type { CommitmentHub } from "@scp/protocol/typechain-types";

export const CommitmentHubAddress =
  "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export const commitmentHub = derived(
  signer,
  ($signer) =>
    new ethers.Contract(
      CommitmentHubAddress,
      CommitmentHubAbi,
      $signer
    ) as unknown as CommitmentHub
);
