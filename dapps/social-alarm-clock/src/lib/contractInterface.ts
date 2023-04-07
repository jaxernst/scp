import { Contract, ethers } from "ethers";
import CommitmentHubAbi from "@scp/sdk/abi/CommitmentHub.json";
import { account, signer } from "./chainClient";
import { derived, writable, type Readable } from "svelte/store";
import { getAlarms } from "./getAlarm";
import type {
  CommitmentHub,
  PartnerAlarmClock,
} from "@scp/protocol/typechain-types";
import { CommitStatus } from "@scp/protocol/lib/types";
import { transactions } from "./transactions";

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

export const userAlarm = derived(
  [account, commitmentHub, transactions],
  ([$user, $commitmentHub], set) => {
    if (!$user?.address || !$commitmentHub?.signer) return;

    getAlarms($commitmentHub, $user.address)
      .then((alarms) => {
        if (alarms && alarms.length > 0) return set(alarms[alarms.length - 1]);
        set(undefined);
      })
      .catch((e) => console.log("Could not fetch alarms", e));
  }
) as Readable<PartnerAlarmClock | undefined>;

export const userAlarmState = derived(userAlarm, ($alarm, set) => {
  if (!$alarm) {
    set(AlarmState.NO_ALARM);
    return;
  }

  $alarm.status().then((status) => {
    if (status === CommitStatus.INACTIVE) return set(AlarmState.PENDING_START);
    if (status === CommitStatus.ACTIVE) return set(AlarmState.ACTIVE);
    return set(AlarmState.UNKNOWN);
  });
});

export const getOtherPlayer = async (
  alarm: PartnerAlarmClock,
  user: string
) => {
  const player1 = await alarm.player1();
  const player2 = await alarm.player2();
  return player1 === user ? player2 : player1;
};
