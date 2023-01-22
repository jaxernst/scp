import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import * as dotenv from 'dotenv'
dotenv.config()

const VAL = parseEther('1')

async function main() {
  if (!process.env.TEST_WALLET) {
    throw Error(".env must have TEST_WALLET to send funds to")
  }
  const [signer,] = await ethers.getSigners()
  signer.sendTransaction({
    to: process.env.TEST_WALLET,
    value: VAL
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
