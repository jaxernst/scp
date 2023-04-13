import type {
  CommitmentHub,
  PartnerAlarmClock,
} from "@scp/protocol/typechain-types";
import {
  getCommitment,
  queryCommitmentCreationEvents,
  queryUserJoinedCommitmentEvents,
} from "@scp/sdk/src/scp-helpers";
import type { commitmentHub } from "./contractInterface";
import type { EvmAddress } from "../types";

/**
 * Get the alarm most recentely created or joined by the user
 */
export const getAlarms = async (
  hub: CommitmentHub,
  userAddress: string
): Promise<PartnerAlarmClock[] | undefined> => {
  const creationEvents = await queryCommitmentCreationEvents(
    hub,
    userAddress,
    "PartnerAlarmClock"
  );

  const userJoinedEvents = await queryUserJoinedCommitmentEvents(
    hub,
    userAddress,
    "PartnerAlarmClock"
  );

  if (creationEvents.length === 0 && userJoinedEvents.length === 0) {
    return;
  }

  // Sort userJoinedEvents and creationEvents by block emitted and get
  // the commitment address for the most recently emitted event
  const events = [...creationEvents, ...userJoinedEvents].sort(
    (a, b) => a.blockNumber - b.blockNumber
  );

  return events.map((event) =>
    getCommitment("PartnerAlarmClock", event.args.commitmentAddr, hub.signer)
  );
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
