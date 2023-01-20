import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { TimelockPenaltyMock } from "../../typechain-types";
import { makeDeploymentFixture } from "../helpers/deploy";
import { advanceTime } from "../helpers/providerUtils";

describe("Penalty Modules", () => {
  describe("TimelockPenalty", () => {
    let timelockPenalty: TimelockPenaltyMock;
    let initializedTimelock: TimelockPenaltyMock;
    let user: SignerWithAddress;

    const deployTarget = makeDeploymentFixture<TimelockPenaltyMock>(
      "TimelockPenaltyMock"
    );
    const depositVal = parseEther("1.234");
    const timelockDur = 60;

    beforeEach(async () => {
      user = (await ethers.getSigners())[0];
      timelockPenalty = await deployTarget();
      initializedTimelock = await deployTarget();
      await initializedTimelock.init(depositVal, timelockDur, {
        value: depositVal,
      });
    });

    it("Initializes input variables to specified values", async () => {
      expect(await initializedTimelock.lockDuration()).to.equal(timelockDur);
      expect(await initializedTimelock.depositValue()).to.equal(depositVal);
    });

    it("Initializes unlockTime to 0", async () => {
      expect(await initializedTimelock.unlockTime()).to.equal(0);
    });

    it("Fails initialization if the depositValue is not sent", async () => {
      await expect(
        timelockPenalty.init(depositVal, timelockDur, {
          value: depositVal.sub(1),
        })
      ).to.be.revertedWith("INSUFFICIENT_VALUE_SENT");
    });

    it("No penalty: Deposit can be withdrawled", async () => {
      await expect(() =>
        initializedTimelock.withdraw(user.address)
      ).to.changeEtherBalance(user, depositVal);
    });

    it("After penalty: Only allows withdrawls after the timelock duration has elasped", async () => {
      await initializedTimelock.penalize();
      await expect(
        initializedTimelock.withdraw(user.address)
      ).to.be.revertedWith("FUNDS_LOCKED");
      await advanceTime(timelockDur);
      await expect(() =>
        initializedTimelock.withdraw(user.address)
      ).changeEtherBalance(user, depositVal);
      await expect(await initializedTimelock.depositValue()).to.equal(0);
    });
  });
});
