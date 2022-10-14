import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("CommitmentProtocolHub")
  const CPH = await factory.deploy()
  console.log("Deployed protocol hub to", CPH.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
