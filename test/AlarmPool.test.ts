import { expect } from "chai";
import { BigNumberish, Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "hardhat/types";

import { AlarmPool, MockAlarmPool, MockAlarmPoolFactory } from "../typechain-types";
import { bn } from "./utils/numbers";
import { advanceTime, advanceTimeHours } from "./utils/providerUtils";
import { DAY, HOUR, MINUTE } from "./utils/time";

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
  return alarmPool;
}

async function deployMockAlarmPool(
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

async function deployMockPoolFactory(): Promise<MockAlarmPoolFactory> {
  const contractFactory = await ethers.getContractFactory("MockAlarmPoolFactory")
  const alarmPoolFacotry = await (await contractFactory.deploy()).deployed()
  return alarmPoolFacotry
}

function systemTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

function getTimestampAtTime(time: string, date="January 1, 2020"): number {
  return (new Date(date + ' ' + time).getTime()) / 1000
} 

describe("Joining Alarm Pools", () => {
  const WAKEUP_TIME = "06:30"
  let user: SignerWithAddress;
  let alarmPool: AlarmPool;

  before(async () => {
    user = (await ethers.getSigners())[0];
  });

  beforeEach(async () => {
    alarmPool = await deployAlarmPool(1000, getTimestampAtTime(WAKEUP_TIME));
  });

  it("Requires users to join the pool with a value to stake", async () => {
    await expect(alarmPool.joinPool([1], 0)).to.revertedWith(
      "Must send value to stake when joining pool"
    );
  });

  it("Records the activationTime as the last wakeup time when joining", async () => {

  })

  
  it("Stores the user's record when joining a pool", async () => {
    const activeOnDays = [1];
    const timezoneOffset = 7;
    const amountStake = ethers.utils.parseEther("100");
    
    await (
      await alarmPool.joinPool(activeOnDays, timezoneOffset, { value: 1 })
      ).wait();
      const userRecord = await alarmPool.userAlarms(user.address);
      expect(userRecord.on).true;
      expect(userRecord.amountStaked).gt(0);
      expect(userRecord.activationTime);
    });
    
    it("Takes a fee upon joining the pool and pays the fee to the factory", async () => {
      const STAKE_AMOUNT = ethers.utils.parseEther('152')
      
      const poolFactory = await deployMockPoolFactory()
      await (await poolFactory.deployAlarmPool(0, systemTimestamp())).wait()
      expect(await ethers.provider.getBalance(poolFactory.address)).to.eq(0)
      
      const alarmPool = await ethers.getContractAt("AlarmPool",  await poolFactory.getAlarmPool())
      await alarmPool.joinPool([1], 0, { value: STAKE_AMOUNT})
      const poolFeePercent = bn(await alarmPool.poolEntryFee()).div(100) // basis points -> percent
      
      const expBalance = STAKE_AMOUNT.mul(poolFeePercent).div(100)
      const expUserStake = STAKE_AMOUNT.sub(expBalance)
      expect(await ethers.provider.getBalance(poolFactory.address)).to.eq(expBalance)
      expect((await alarmPool.userAlarms(user.address)).amountStaked).to.eq(expUserStake)
    });

    describe("AlarmPool Active Days Input Array", () => {
      it("Disallows alarm day arrays with 0 length", async () => {
        await expect(alarmPool.joinPool([], 0, { value: 1 })).to.revertedWith(
          "activeOnDays array invalid"
        );
      });
      it("Disallows alarm day arrays with length greater than 7", async () => {
        await expect(
          alarmPool.joinPool([1, 2, 3, 4, 5, 6, 7, 5], 0, { value: 1 })
        ).to.revertedWith("activeOnDays array invalid");
      });
      it("Disallows alarm day arrays with values outside the range [1,7]", async () => {
        await expect(alarmPool.joinPool([8], 0, { value: 1 })).to.revertedWith(
          "activeOnDays array invalid"
        );
        await expect(alarmPool.joinPool([0], 0, { value: 1 })).to.revertedWith(
          "activeOnDays array invalid"
        );
        await expect(alarmPool.joinPool([1], 0, { value: 1 })).to.not.reverted;
      });
    });
});

describe("Enforcing Wakeups", () => {
  const ALARM_POOL_PENALTY = 345 // 3.45 %
  const WAKEUP_TIME = "8:30"
  const firstTimestamp =  getTimestampAtTime("08:30")
  let alarmPool: AlarmPool
  
  beforeEach(async () => {
    alarmPool = await deployAlarmPool(
      ALARM_POOL_PENALTY, 
      firstTimestamp
    )
  })

  it("Prevents wakeups from being submitted before wakeup window opens", async () => {
  })
  it("Prevents wakeups from being submitted after wakeup window")
  it("Penalizes users according to the pool penalty")
  it("Enforces wakeups based on the user's selected timezone")
  it("Enforces wakeups only on the users active wakeup days (no timezone offset")
})

describe("Alarm Pool Internal Functions", () => {
  it("_nextWakeupTime()", async () => {
    const startTime = systemTimestamp(); // seconds
    let expNextWakeup = startTime + DAY;
    const alarmPool = await deployMockAlarmPool(1000, startTime);

    const checkExp = async (expNextWakeup: number) => {
      const randomOffsets = [
        0, 1000, -12, -50000000, 3422853498, 34, -22222122,
      ];
      for (let offset in randomOffsets) {
        const exp = expNextWakeup + Number(offset);
        expect(await alarmPool.nextWakeupTime(offset)).to.eq(exp);
      }
    };

    await checkExp(expNextWakeup);
    await advanceTime(23 * HOUR);
    await checkExp(expNextWakeup);
    await advanceTime(59 * MINUTE);
    await checkExp(expNextWakeup);
    await advanceTime(5 * MINUTE);
    await checkExp(expNextWakeup + DAY);
    await advanceTime(403 * DAY);
    await checkExp(expNextWakeup + 404 * DAY);
  });
  it("_missedWakeups()")
});
