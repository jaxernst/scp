import { expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { createCommitment } from "../../lib/commitmentCreation";
import { CommitStatus } from "../../lib/types";
import {
  CommitmentHub,
  PartnerAlarmClock,
  TimelockingDeadlineTask,
} from "../../typechain-types";
import { deployTyped } from "../helpers/deploy";
import { advanceTime } from "../helpers/providerUtils";
import { currentTimestamp, dayOfWeek, timeOfDay } from "../helpers/time";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Partner Alarm Clock test", () => {
  let hub: CommitmentHub;
  let alarm: PartnerAlarmClock;
  let blockTime: BigNumber;
  let p1: SignerWithAddress;
  let p2: SignerWithAddress;

  const collateralVal = parseEther("1");
  const deadline = 60; // seconds in the future
  const submissionWindow = 30; // seconds

  const initCommitment = async (otherPlayer: string) => {
    return await createCommitment(
      hub,
      "PartnerAlarmClock",
      {
        alarmTime: blockTime.add(deadline),
        alarmdays: [1, 2, 3, 4, 5, 6, 7],
        submissionWindow: submissionWindow,
        missedAlarmPenalty: 0.1,
        timezoneOffset: 0,
        otherPlayer,
      },
      collateralVal
    );
  };

  before(async () => {
    hub = await deployTyped<CommitmentHub>("CommitmentHub");
  });

  beforeEach(async () => {
    [p1, p2] = await ethers.getSigners();
    blockTime = await currentTimestamp();
  });

  it("Returns the time until the next alarm is due", async () => {
    const curTime = timeOfDay(blockTime.toNumber());
    const curDay = dayOfWeek(blockTime.toNumber());

    const alarm = await createCommitment(
      hub,
      "PartnerAlarmClock",
      {
        alarmTime: curTime + 60,
        alarmdays: [curDay],
        missedAlarmPenalty: parseEther("0.1"),
        submissionWindow: submissionWindow,
        timezoneOffset: 0,
        otherPlayer: p2.address,
      },
      collateralVal
    );

    const resultP1 = await alarm.timeToNextDeadline(p1.address);
    const resultP2 = await alarm.timeToNextDeadline(p2.address);
    expect(resultP1).to.approximately(60, 3);
    expect(resultP2).to.approximately(60, 3);
  });
});
