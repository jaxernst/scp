import { expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { createCommitment } from "../../lib/commitmentCreation"
import { CommitStatus } from "../../lib/types"
import { BaseCommitment, CommitmentHub, TimelockingDeadlineTask } from "../../typechain-types"
import { deployTyped } from "../helpers/deploy"
import { advanceTime } from "../helpers/providerUtils"
import { currentTimestamp } from "../helpers/time"


describe("Commitment Implementation #1: TimelockDeadlineTask", () => {
    let hub: CommitmentHub
    let commitment: TimelockingDeadlineTask | BaseCommitment
    let blockTime: BigNumber
    let user: Signer

    const collateralVal = parseEther("1")
    const deadline = 60 // seconds in the future
    const submissionWindow = 30 // seconds
    const timelockDuration = 100 // seconds
    const taskDescription = "Test task description"

    before(async () => {
        hub = await deployTyped<CommitmentHub>("CommitmentHub")
    })

    beforeEach(async () => {
        blockTime = await currentTimestamp()
        commitment = await createCommitment(hub, "TimelockingDeadlineTask", {
            deadline: blockTime.add(deadline),
            submissionWindow: submissionWindow,
            timelockDuration: timelockDuration,
            taskDescription
        }, collateralVal)
        user = commitment.signer
    })
    it("Does not allow confirmations to be submitted before the submission window", async () => {
        await expect(commitment.submitConfirmation()).to.be.revertedWith("NOT_IN_SUBMISSION_WINDOW")
        await expect(commitment.submitConfirmationWithProof("")).to.be.revertedWith("NOT_IN_SUBMISSION_WINDOW")
    })
    
    const expectSuccess = async (func: any) => {
        await expect(func)
            .to.changeEtherBalance(user, collateralVal)
            .to.emit(commitment, "StatusChanged")
            .withArgs(CommitStatus.ACTIVE, CommitStatus.COMPLETE)

        expect(await commitment.provider.getBalance(commitment.address)).to.equal(0)
        expect(await commitment.status()).to.equal(CommitStatus.COMPLETE)
    }

    it("Marks the commitment as complete and withdraws the deposit upon confirmation (within submission window)", async () => {
        await advanceTime(35)
        await expectSuccess(commitment.submitConfirmation())
    })
    it("Allows proof URIs to be submitted along with the confirmation", async () => {
        await advanceTime(50)
        await expectSuccess(commitment.submitConfirmationWithProof(""))
    })

    it("Locks funds for the specified duration if the confirmation deadline is missed")
    it("Allows canceling and withdrawing before the submission window")
})

describe("Commitment type: Deadline", async () => {
    /**
     * !!Caution: Under construction!! :)
     
    let genericCommit: DeadlineCommitment
    before(async () => {
      genericCommit = await createCommitment(hub, CommitType.DEADLINE, {
        deadline: maxUint(256), submissionWindow: 60, name: "", description: "", 
      })
    })

    it("Sets the schedule type as the 'DEADLINE' schedule type", async () => {
      expect(await genericCommit.scheduleType()).to.equal(ScheduleType.DEADLINE)
    })
    
    it("Sets the commitment name and description as specified by the user", async () => {
      const commitment = await createCommitment(hub, CommitType.DEADLINE, {
        deadline: maxUint(256),
        submissionWindow: 1,
        name: "Name", 
        description: "Description", 
      });

      expect(await commitment.name()).to.equal("Name");
      // ToDo: Read event history for this check
      // expect(await commitment.commitmentDescription()).to.equal("Description");
    });

    it("Cannot be initialized with a deadline in the past", async () => {
      await expect(
        createCommitment(hub, CommitType.DEADLINE, 
          { deadline: 0, submissionWindow: 0, name: "", description: "" }
        )
      ).to.revertedWith("DEADLINE_PASSED");
    });

    describe("submitConfirmation()", () => {
      it("Cannot submit a confirmation before the submission window", async () => {
        const commit = await createCommitment(hub, CommitType.DEADLINE, {
          deadline: await fromNow(60),
          submissionWindow: 1,
          name: "", 
          description: "",
        });

        await expect(commit.submitConfirmation()).to.revertedWith(
          "NOT_IN_SUBMISSION_WINDOW"
        );
      });

      it("Cannot submit a confirmation after the deadline", async () => {
        const commit = await createCommitment(hub, CommitType.DEADLINE, {
          deadline: await fromNow(500),
          submissionWindow: 1,
          name: "", 
          description: "", 
        });

        await advanceTime(501);
        await expect(commit.submitConfirmation()).to.revertedWith(
          "NOT_IN_SUBMISSION_WINDOW"
        );
      });

      it("Gets marked as complete if a confirmation is submitted within the window", async () => {
        const commit = await createCommitment(hub, CommitType.DEADLINE, {
          deadline: await fromNow(60),
          submissionWindow: 60,
          name: "", 
          description: "", 
        });

        await advanceTime(5);
        await expect(commit.submitConfirmation()).to.emit(
          commit,
          "ConfirmationSubmitted"
        );

        expect(await commit.status()).to.equal(CommitStatus.COMPLETE);
      });
    });

    describe("missedDeadlines()", () => {
      let commitment: DeadlineCommitment
      let deadline = 10 // seconds from now
      let submissionWindow = 5 // seconds before deadline
      beforeEach(async () => { 
        commitment = await createCommitment(hub, CommitType.DEADLINE, {
          deadline: await fromNow(deadline), 
          submissionWindow,
          name: "", 
          description: "",
        })
      })

      it("Returns 0 before deadline", async () => {
        expect(await commitment.deadline()).gt(await currentTimestamp())
        expect(await commitment.missedDeadlines()).to.equal(0)
      })

      it("(after deadline) Returns 0 if a confirmation was submitted within the window", async () => {
        await advanceTime(deadline - submissionWindow + 1)
        await (await commitment.submitConfirmation()).wait()
        await advanceTime(500)
        expect(await commitment.missedDeadlines()).to.equal(0)
      })

      it("(after deadline) Returns 1 if no confirmation was submitted within the window", async () => {
        await advanceTime(deadline + 1)
        expect(await commitment.missedDeadlines()).to.equal(1)
      })
    }) */
  }); 