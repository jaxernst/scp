import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { createCommitment } from "../lib/commitmentCreation";
import { CommitType } from "../lib/types";
import {
  CommitmentHub,
  DeadlineCommitment,
  MissedDeadlineTimelock,
} from "../typechain-types";
import { deploy } from "./helpers/deploy";
import { maxUint } from "./helpers/numbers";
import { advanceTime, advanceToTimestamp } from "./helpers/providerUtils";
import { currentTimestamp, fromNow } from "./helpers/time";

describe("EnforcementModules", () => {
  let hub: CommitmentHub;
  let user: SignerWithAddress
  let rando: SignerWithAddress

  before(async () => {
    hub = await deploy("CommitmentHub");
    user = (await ethers.getSigners())[0]
    rando = (await ethers.getSigners()).splice(-1)[0]
  });

  describe("Timelock Enforcement Module", () => {
    let stakeAmount = parseEther("100")
    let timelockDuration = 5000 // seconds
    let commitDuration = 600 // seconds
    let submissionWindow = commitDuration / 2
    let genericDeadlineCommit: DeadlineCommitment;
    let timelock: MissedDeadlineTimelock;
    let joinedTimelock: MissedDeadlineTimelock;

    beforeEach(async () => {
      timelock = await deploy("MissedDeadlineTimelock")
      genericDeadlineCommit = await createCommitment(hub, CommitType.DEADLINE, {
        name: "",
        description: "",
        deadline: await fromNow(commitDuration),
        submissionWindow,
      });

      joinedTimelock = await deploy("MissedDeadlineTimelock")
      await (await joinedTimelock.join(
        genericDeadlineCommit.address, 
        timelockDuration, 
        { value: stakeAmount }
      )).wait()
    });
  
    describe("Timelock: Joining", () => {
      it("Requires users to stake funds when joining", async () => {
        const stakeAmount = parseEther("13")
        await expect(
          timelock.join(genericDeadlineCommit.address, 1)
        ).to.revertedWith("STAKE_VALUE_NOT_SENT");

        await (await timelock.join(genericDeadlineCommit.address, 1, { value: stakeAmount })).wait();

        expect((await timelock.userEntries(user.address)).stake).to.equal(stakeAmount);
      });

      it("Only allows the commitment owner to enter their commitment", async () => {
        
        await expect(timelock.connect(rando).join(genericDeadlineCommit.address, 0))
          .to.revertedWith("ONLY_OWNER_ACTION")
      });

      it("Only allows commitments with Deadline shcedule types", async () => {
        const nonDeadlineCommit = await createCommitment(hub, CommitType.BASE, {
          name: "", description: ""
        })

        expect(timelock.join(nonDeadlineCommit.address, 0))
          .to.revertedWith("INCOMPATIBLE_COMMIT_TYPE")
      });

      it("Sets the user unlock time to the commitment deadline + lock duration", async () => {
        const expUnlockTimestamp = (await genericDeadlineCommit.deadline()).add(timelockDuration)
        expect((await joinedTimelock.userEntries(user.address)).unlockTime)
          .to.equal(expUnlockTimestamp)
      })
    });
    describe("Timelock: Penalizing", () => {
      it("Sets a user entry to locked if a deadline was missed", async () => {
        await advanceTime(commitDuration);
        await (await joinedTimelock.penalize(user.address)).wait();
        expect((await joinedTimelock.userEntries(user.address)).locked).true
      });
      it("Reverts if the user has not missed any deadlines", async () => {
        await advanceTime(submissionWindow)
        await (await  genericDeadlineCommit.submitConfirmation()).wait()
        expect(await genericDeadlineCommit.missedDeadlines()).to.equal(0)
        await expect(joinedTimelock.penalize(user.address)).to.revertedWith("NOTHING_TO_PENALIZE")
      });
    });
    describe("Timelock: Exiting/Withdraws", () => {
      it("Allows the user to withdraw before the commitment's submission window opens", async () => {
        const deadline = await genericDeadlineCommit.deadline()
        const submissionOpenTime = deadline.sub(await genericDeadlineCommit.submissionWindow())
        expect(await currentTimestamp()).lt(submissionOpenTime)
        expect(joinedTimelock.exit())
      });

      it("Does not allow a user to withdraw if the current time is within the submission window", async () => {
        await advanceTime(commitDuration - submissionWindow + 1)
        await expect(joinedTimelock.exit()).to.revertedWith(
          "CANT_WITHDRAW_IN_SUBMISSION_WINDOW"
        )
      });
      it("Missed deadline: Allows a user to withdraw after the timelock duration has passed", async () => {
        const deadline = await genericDeadlineCommit.deadline()
        await advanceTime(deadline)
        
      });
      it(
        "Missed deadline: Does not allow a user to withdraw within the timelock time"
      );
    });
  });
});
