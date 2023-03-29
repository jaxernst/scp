import type {
  CommitmentHub,
  PartnerAlarmClock,
} from "@scp/protocol/typechain-types";
import {
  getCommitment,
  queryCommitmentCreationEvents,
} from "@scp/sdk/src/scp-helpers";

export const getAlarm = async (
  hub: CommitmentHub,
  userAddress: string
): Promise<PartnerAlarmClock | undefined> => {
  const events = await queryCommitmentCreationEvents(
    hub,
    userAddress,
    "PartnerAlarmClock"
  );
  console.log(events, userAddress);
  if (events.length === 0) {
    return;
  }

  const commitment = getCommitment(
    "PartnerAlarmClock",
    events[events.length - 1].args.commitmentAddr,
    hub.signer
  );

  return commitment;
};
