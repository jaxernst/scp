import { Contract } from "ethers";
import { ethers } from "hardhat";

export async function deploy(name: string): Promise<Contract> {
  const contract = await (await ethers.getContractFactory(name)).deploy();
  await contract.deployed();
  return contract;
}

export async function deployTyped<T extends Contract>(
  name: string
): Promise<T> {
  return (await deploy(name)) as T;
}

export function makeDeploymentFixture<T extends Contract>(
  name: string
): () => Promise<T> {
  return async () => await deployTyped<T>(name);
}

/*
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
  } */
