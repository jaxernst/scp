import { BigNumberish } from "ethers"
import { ethers } from "hardhat";
import { AlarmPool, MockAlarmPool, MockAlarmPoolFactory } from "../../typechain-types";

export async function deploy(name: string): Contract {
  const contract = await (await ethers.getContractFactory(name)).deploy()
  await contract.deployed()
  return contract
}


export async function deployAlarmPool(
    missedWakeupPenaltyBps: BigNumberish,
    firstWakeupTimestamp: BigNumberish
  ): Promise<AlarmPool> {
    const contractFactory = await ethers.getContractFactory("AlarmPool");
    const alarmPool = await contractFactory.deploy(
      missedWakeupPenaltyBps,
      firstWakeupTimestamp
    );
    await alarmPool.deployed();
    return alarmPool;
  }
  
export async function deployMockAlarmPool(
    missedWakeupPenaltyBps: BigNumberish,
    firstWakeupTimestamp: BigNumberish
  ): Promise<MockAlarmPool> {
    const contractFactory = await ethers.getContractFactory("MockAlarmPool");
    const alarmPool = await contractFactory.deploy(
      missedWakeupPenaltyBps,
      firstWakeupTimestamp
    );
    await alarmPool.deployed();
    return alarmPool;
  }
  
export async function deployMockPoolFactory(): Promise<MockAlarmPoolFactory> {
    const contractFactory = await ethers.getContractFactory(
      "MockAlarmPoolFactory"
    );
    const alarmPoolFacotry = await (await contractFactory.deploy()).deployed();
    return alarmPoolFacotry;
  }