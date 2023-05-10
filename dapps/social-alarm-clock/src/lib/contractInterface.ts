import { Contract, ethers } from "ethers";
import CommitmentHubAbi from "@scp/sdk/abi/CommitmentHub.json";
import { account, signer } from "./chainClient";
import { derived, writable, type Readable, get } from "svelte/store";
import { getAlarms } from "./alarmHelpers";
import type {
  CommitmentHub,
  PartnerAlarmClock,
} from "@scp/protocol/typechain-types";
import { CommitStatus } from "@scp/protocol/lib/types";
import { transactions } from "./transactions";
import type { CommitmentInfo } from "@scp/sdk/src/scp-helpers";

export enum AlarmState {
  NO_ALARM,
  PENDING_START,
  ACTIVE,
  UNKNOWN,
}

export const CommitmentHubAddress =
  "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export const commitmentHub = derived(signer, ($signer) => {
  return new ethers.Contract(
    CommitmentHubAddress,
    CommitmentHubAbi,
    $signer
  ) as unknown as CommitmentHub;
});

// Will add listeners to update alarm state and alarm fields after transactions
export const userAlarms = derived(
  [account, commitmentHub, transactions],
  ([$user, $commitmentHub], set) => {
    if (!$user?.address || !$commitmentHub?.signer) return;

    getAlarms($commitmentHub, $user.address)
      .then((alarms) => {
        if (alarms && Object.keys(alarms).length > 0) return set(alarms);
        set(undefined);
      })
      .catch((e) => console.log("Could not fetch alarms", e));
  }
) as Readable<Record<number, CommitmentInfo<"PartnerAlarmClock">> | undefined>;
