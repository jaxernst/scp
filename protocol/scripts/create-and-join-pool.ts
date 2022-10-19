import { ethers } from "hardhat";

const HUB_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const getSeconds = (hour: number, minute?: number, second?: number) => {
    return hour*60*60 + (minute ? minute*60 : 0) + (second ? second : 0)
}

async function main() {
  const [signer] = await ethers.getSigners()
  const CPH = await ethers.getContractAt("CommitmentProtocolHub", HUB_ADDR)
  
  const alarmSeconds = getSeconds(8, 30)
  const nextPoolId = await CPH.nextPoolId()
  await (await CPH.createAlarmPool(1000, alarmSeconds)).wait()
  
  const pool = await ethers.getContractAt(
    "AlarmPool", 
    await CPH.deployedPools(nextPoolId)
  )

  await (
    await pool.joinPool([1, 2, 3, 4, 5, 6, 7], -7, { value: 100})
  ).wait()

  console.log(await CPH.userPools(signer.address))
  console.log("Deployed protocol hub to", CPH.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
