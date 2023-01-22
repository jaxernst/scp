import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("CommitmentHub")
  const CPH = await factory.deploy()
  console.log("Deployed protocol hub to", CPH.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
