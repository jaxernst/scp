import { Signer, Wallet } from "ethers";
import { ethers } from "hardhat";
import {
  HOUR,
  MINUTE,
  currentTimestamp,
  systemTimestamp,
  timeOfDay,
} from "../test/helpers/time";
import { encodeCreationParams } from "@scp/sdk";
import { commitmentTypeVals, solidityInitializationTypes } from "../lib/types";
import { parseEther } from "ethers/lib/utils.js";
import { waitForBlock, waitForOneBlock } from "../test/helpers/providerUtils";
import { connectionError } from "../../dapps/pledger/src/lib/stores/dAppReady";

require("dotenv").config();

const HUB_ADDR = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

async function main() {
  const [signer] = await ethers.getSigners();
  const u1 = new Wallet(process.env.TEST_U1_KEY as string, ethers.provider);
  const u2 = new Wallet(process.env.TEST_U2_KEY as string, ethers.provider);

  const commitment = (
    await ethers.getContractAt("CommitmentHub", HUB_ADDR)
  ).connect(u1);

  for (let u of [u1, u2]) {
    await signer.sendTransaction({ to: u.address, value: parseEther("1") });
  }

  let today = new Date();
  const blockTimestamp = (await currentTimestamp()).toNumber();
  const alarmTime = timeOfDay(blockTimestamp, -7) + 3 * MINUTE;
  const dayOfWeek = [2, 3, 4, 5, 6, 7];
  const submissionWindow = 10 * MINUTE;
  const missedAlarmPenalty = parseEther("0.1");

  const encoded = ethers.utils.defaultAbiCoder.encode(
    solidityInitializationTypes["PartnerAlarmClock"],
    [
      alarmTime,
      dayOfWeek,
      missedAlarmPenalty,
      submissionWindow,
      -7 * HOUR,
      u2.address,
    ]
  );

  const tx = await commitment.createCommitment(
    commitmentTypeVals["PartnerAlarmClock"],
    encoded,
    { value: missedAlarmPenalty }
  );

  const rc = await tx.wait();

  const commitAddr = rc.events?.find((e) => e.event === "CommitmentCreation")
    ?.args?.commitmentAddr;

  const commit = await ethers.getContractAt("PartnerAlarmClock", commitAddr);
  const tx1 = await commit.connect(u2).start({ value: missedAlarmPenalty });
  await tx1.wait();
  await waitForOneBlock();
  console.log(systemTimestamp());
  console.log((await currentTimestamp()).toNumber());
  console.log((await commit.timeToNextDeadline(u2.address)).toNumber());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
