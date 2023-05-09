import { ethers } from "hardhat";
import { CommitmentHub } from "../typechain-types";
import { CommitmentType, commitmentTypeVals } from "../lib/types";
import {
  registerCommitmentType,
  createScpContext,
  createWalletFromKey,
} from "../../sdk/src";

async function main() {
  const factory = await ethers.getContractFactory("CommitmentHub");
  const CPH = await factory.deploy();
  console.log("Deployed protocol hub to", CPH.address);

  // Deploy a partner alarm clock template
  const pacTemplate = await (
    await ethers.getContractFactory("PartnerAlarmClock")
  ).deploy();

  const hhWalletPrivateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  // Create wallet
  const wallet = createWalletFromKey("hardhat", hhWalletPrivateKey);

  // Create context
  const ctx = createScpContext(wallet);

  // Register partner alarm clock
  console.log(
    await registerCommitmentType(
      ctx,
      "PartnerAlarmClock",
      pacTemplate.address as `0x${string}`
    )
  );

  // Create commitment
  // Print out staet of commitments
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
