import type {
  CommitmentHub,
  PartnerAlarmClock,
} from "@scp/protocol/typechain-types";
import {
  getCommitment,
  queryCommitmentCreationEvents,
  queryUserJoinedCommitmentEvents,
} from "@scp/sdk/src/scp-helpers";

/**
 * Get the alarm most recentely created or joined by the user
 */
export const getMostRecentAlarm = async (
  hub: CommitmentHub,
  userAddress: string
): Promise<PartnerAlarmClock | undefined> => {
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

  const commitment = getCommitment(
    "PartnerAlarmClock",
    events[events.length - 1].args.commitmentAddr,
    hub.signer
  );

  return commitment;
};
