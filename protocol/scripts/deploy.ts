import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { createCommitment } from "../lib/commitmentCreation";
import { CommitmentType, commitmentTypeVals } from "../lib/types";
import { CommitmentHub } from "../typechain-types";

/**
 * Deploy protocol hub and register commitment types
 */
async function main() {
  const factory = await ethers.getContractFactory("CommitmentHub");
  const CPH = await factory.deploy();
  console.log("Deployed protocol hub to", CPH.address);

  await registerType(CPH, "BaseCommitment");
  console.log("Registered BaseCommitment");
  await registerType(CPH, "TimelockingDeadlineTask");
  console.log("Registered TimelockingDeadlineCommitment");
  await registerType(CPH, "PartnerAlarmClock");
}

async function registerType(hub: CommitmentHub, type: CommitmentType) {
  const contract = await (await ethers.getContractFactory(type)).deploy();
  await (
    await hub.registerCommitType(commitmentTypeVals[type], contract.address)
  ).wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
