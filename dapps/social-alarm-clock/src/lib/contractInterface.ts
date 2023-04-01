import { ethers } from "ethers";
import CommitmentHubAbi from "@scp/sdk/abi/CommitmentHub.json";
import { account, signer } from "./chainClient";
import { derived, type Readable } from "svelte/store";
import type {
  CommitmentHub,
  PartnerAlarmClock,
} from "@scp/protocol/typechain-types";
import { getMostRecentAlarm } from "./getAlarm";
import { CommitStatus } from "@scp/protocol/lib/types";
import type { EvmAddress } from "../types";

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

export const userAlarm = derived(
  [commitmentHub, account],
  ([$hub, $account], set) => {
    if (!$hub || !$hub.provider || !$account) return set(undefined);

    getMostRecentAlarm($hub, $account.address)
      .then((result) => set(result))
      .catch((err) => {
        console.error(err);
        set(undefined);
      });
  },
  undefined
) as Readable<PartnerAlarmClock | undefined>;

export const userHasActiveAlarm = derived([userAlarm], ([$alarm], set) => {
  if (!$alarm) return set(false);

  $alarm.status().then((status) => {
    set(status === CommitStatus.ACTIVE);
    console.log("Alarm status:", status);
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
