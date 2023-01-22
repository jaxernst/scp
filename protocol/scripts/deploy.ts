import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("CommitmentHub")
  const CPH = await factory.deploy()
  console.log("Deployed protocol hub to", CPH.address)

  const [signer,] = await ethers.getSigners()
  signer.sendTransaction({
    to: "0xdD044684cfA651c491b844AE0E8646aD7c56205b",
    value: parseEther('1')
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
