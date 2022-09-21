import { expect } from "chai";
import { BigNumberish, Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "hardhat/types"

import { AlarmPool } from "../typechain-types";

async function deployAlarmPool(
  missedWakeupPenaltyBps: BigNumberish,
  firstWakeupTimestamp: BigNumberish
): Promise<AlarmPool> {
  const contractFactory = await ethers.getContractFactory("AlarmPool");
  const alarmPool = await contractFactory.deploy(
    missedWakeupPenaltyBps,
    firstWakeupTimestamp
  );
  await alarmPool.deployed();
  console.log(alarmPool.address)
  return alarmPool;
}

function systemTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

describe("Joining Alarm Pools", () => {
  let user: SignerWithAddress
  let alarmPool: AlarmPool
  
  before(async () => {
    user = (await ethers.getSigners())[0] 
  })

  beforeEach(async () => {
    alarmPool = await deployAlarmPool(1000, systemTimestamp())
  })

  it("Requires users to join the pool with a value to stake", async () => {
    const activeOnDays = [1,2,3]
    const timezoneOffset = 1
    console.log(alarmPool.address)
    await expect(alarmPool.joinPool([1], 0)).to.revertedWith("Must send value to stake when joining pool")
  })

  it("Stores the user's record when joining a pool", async () => {
    const activeOnDays = [1,2,3]
    const timezoneOffset = 1
    console.log(alarmPool.address)
    await (await alarmPool.joinPool(activeOnDays, timezoneOffset, {value: 1})).wait()

    console.log(alarmPool.userAlarms(user.address))
  });
});

describe("Alarm Pool Internal Functions", () => {});
