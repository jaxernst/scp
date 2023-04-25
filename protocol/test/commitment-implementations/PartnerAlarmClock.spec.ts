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
import {
  DAY,
  HOUR,
  currentTimestamp,
  dayOfWeek,
  timeOfDay,
} from "../helpers/time";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Partner Alarm Clock test", () => {
  let hub: CommitmentHub;
  let alarm: PartnerAlarmClock;
  let blockTime: number;
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
        alarmTime: 0,
        alarmdays: [1, 2, 3, 4, 5, 6, 7],
        submissionWindow: submissionWindow,
        missedAlarmPenalty: parseEther("0.1"),
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
    blockTime = (await currentTimestamp()).toNumber();
  });

  it("Cannot record entries or view missed deadlines until started", async () => {
    const alarm = await initCommitment(p2.address);
    await expect(alarm.connect(p1).submitConfirmation()).to.be.revertedWith(
      "NOT_STARTED"
    );
    await expect(alarm.connect(p2).submitConfirmation()).to.be.revertedWith(
      "NOT_STARTED"
    );

    await expect(alarm.missedDeadlines(p1.address)).to.be.revertedWith(
      "NOT_STARTED"
    );
    await expect(alarm.missedDeadlines(p2.address)).to.be.revertedWith(
      "NOT_STARTED"
    );
  });

  it("Returns the time until the next alarm is due (0 offset)", async () => {
    const curTime = timeOfDay(blockTime);
    const curDay = dayOfWeek(blockTime);

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

    await alarm.connect(p2).start({ value: collateralVal });

    const resultP1 = await alarm.timeToNextDeadline(p1.address);
    const resultP2 = await alarm.timeToNextDeadline(p2.address);
    expect(resultP1).to.approximately(60, 3);
    expect(resultP2).to.approximately(60, 3);
  });

  it("Returns the time until the next alarm is due (local tz offset)", async () => {
    const localOffset = new Date().getTimezoneOffset() * -60;
    const curTime = timeOfDay(blockTime, localOffset);
    const curDay = dayOfWeek(blockTime, localOffset);
    const alarmTime = curTime + 60;
    const alarm = await createCommitment(
      hub,
      "PartnerAlarmClock",
      {
        alarmTime: alarmTime,
        alarmdays: [curDay, curDay + 1],
        missedAlarmPenalty: parseEther("0.1"),
        submissionWindow: submissionWindow,
        timezoneOffset: localOffset,
        otherPlayer: p2.address,
      },
      collateralVal
    );

    await alarm.connect(p2).start({ value: collateralVal });

    const resultP1 = await alarm.timeToNextDeadline(p1.address);
    const resultP2 = await alarm.timeToNextDeadline(p2.address);
    expect(resultP1).to.approximately(60, 3);
    expect(resultP2).to.approximately(60, 3);

    // Advance time to the next day
    await advanceTime(60 * 60 * 20);
    const blockTime2 = (await currentTimestamp()).toNumber();
    const curTime2 = timeOfDay(blockTime2, localOffset);
    expect(curTime2).to.approximately((curTime + HOUR * 20) % DAY, 5);

    const result2P1 = await alarm.timeToNextDeadline(p1.address);
    const result2P2 = await alarm.timeToNextDeadline(p2.address);
    expect(result2P1).to.approximately(alarmTime - curTime2, 3);
    expect(result2P2).to.approximately(alarmTime - curTime2, 3);
  });
});
