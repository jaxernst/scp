import type {
  CommitmentHub,
  PartnerAlarmClock,
} from "@scp/protocol/typechain-types";
import {
  getCommitment,
  getUserCommitmentsByType,
  queryCommitmentCreationEvents,
  queryUserJoinedCommitmentEvents,
} from "@scp/sdk/src/scp-helpers";
import type { commitmentHub } from "./contractInterface";
import type { EvmAddress } from "../types";

/**
 * Get the alarm most recentely created or joined by the user
 */
export const getAlarms = async (hub: CommitmentHub, userAddress: string) => {
  return getUserCommitmentsByType(hub, "PartnerAlarmClock");
};

export const getAlarmById = async (
  id: string,
  commitmentHub: CommitmentHub
) => {
  const commitmentAddr = await commitmentHub.commitments(id);
  if (!commitmentAddr) return;
  return getCommitment(
    "PartnerAlarmClock",
    commitmentAddr,
    commitmentHub.signer
  );
};

export const getBetStanding = async (
  targetPlayer: EvmAddress,
  alarm: PartnerAlarmClock
) => {
  const otherPlayer = await getOtherPlayer(alarm, targetPlayer);
  const urMissedDeadlines = await alarm.missedDeadlines(targetPlayer);
  const theirMissedDeadlines = await alarm.missedDeadlines(otherPlayer);
  const alarmPenalty = await alarm.missedAlarmPenalty();
  return alarmPenalty.mul(theirMissedDeadlines.sub(urMissedDeadlines));
};

export const getOtherPlayer = async (
  alarm: PartnerAlarmClock,
  user: string
) => {
  const player1 = await alarm.player1();
  const player2 = await alarm.player2();
  return player1 === user ? player2 : player1;
};
