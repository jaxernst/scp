import { expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { createCommitment } from "../../lib/commitmentCreation"
import { CommitStatus } from "../../lib/types"
import { CommitmentHub, TimelockingDeadlineTask } from "../../typechain-types"
import { deployTyped } from "../helpers/deploy"
import { advanceTime } from "../helpers/providerUtils"
import { currentTimestamp } from "../helpers/time"


describe("Commitment Implementation #1: TimelockDeadlineTask", () => {
    let hub: CommitmentHub
    let commitment: TimelockingDeadlineTask
    let blockTime: BigNumber
    let user: Signer

    const collateralVal = parseEther("1")
    const deadline = 60 // seconds in the future
    const submissionWindow = 30 // seconds
    const timelockDuration = 100 // seconds
    const taskDescription = "Test task description"

    const initCommitment = async () => {
      return await createCommitment(hub, "TimelockingDeadlineTask", {
        deadline: blockTime.add(deadline),
        submissionWindow: submissionWindow,
        timelockDuration: timelockDuration,
        taskDescription
    }, collateralVal)
    }

    before(async () => {
        hub = await deployTyped<CommitmentHub>("CommitmentHub")
    })

    beforeEach(async () => {
        blockTime = await currentTimestamp()
        commitment = await initCommitment()
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

    it("Marks the commitment as complete and applies penalty when submitting after the deadline", async () => {
      await advanceTime(100)
      const time = await currentTimestamp()
      await expect(commitment.submitConfirmation()).to.changeEtherBalance(commitment, 0)
        .to.emit(commitment, "StatusChanged")
        .withArgs(CommitStatus.ACTIVE, CommitStatus.COMPLETE)
      expect(await commitment.unlockTime()).greaterThan(time.add(timelockDuration))
    })

    it("Applies penalty when withdraw() is called with a missed deadline", async () => {
      await advanceTime(100)
      const time = await currentTimestamp()
      await expect(commitment.withdraw()) 
        .to.changeEtherBalance(commitment, 0)
        .to.not.reverted
      expect(await commitment.unlockTime()).greaterThan(time.add(timelockDuration))
    })
    
    it("Prevents a penalty from being applied more than once (prevents extending timelock duraiton)", async () => {
      await advanceTime(100)
      const blockTime = await currentTimestamp()
      await commitment.withdraw()
      const unlockTime = await commitment.unlockTime()
      expect(unlockTime).greaterThanOrEqual(blockTime)
      await commitment.submitConfirmation()
      await commitment.withdraw()
      expect(await commitment.unlockTime()).to.be.equal(unlockTime)
    })

    it("Allows cancelling and withdrawing before the submission window", async () => {
      // Provide extra funds to the contract befoer attemping a double withdraw
      await user.sendTransaction({ to: commitment.address, value: parseEther('10')})
      
      // #1 withdraw then attempt to cancel
      expect(await commitment.callStatic.withdraw()).to.equal(true) // success: true
      await expect(commitment.withdraw()).to.changeEtherBalance(user, collateralVal)
      // Cancelling should not change ether balance because balance was already withdrawn
      await expect(commitment.cancel()).to.changeEtherBalance(user, 0)

      // #2 cancel then attempt to withdraw
      const commitment2 = await initCommitment()
      await expect(commitment2.cancel()).to.changeEtherBalance(user, collateralVal)
      expect(await commitment2.callStatic.withdraw()).to.equal(false)
      await expect(commitment2.withdraw()).to.changeEtherBalance(user, 0)
    })
})