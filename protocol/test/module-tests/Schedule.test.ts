import { waffle } from "hardhat"
import { expect } from "chai";
import { BigNumber } from "ethers";
import { deployTyped, makeDeploymentFixture } from "../helpers/deploy"
import { currentTimestamp } from "../helpers/time"
import { advanceTime } from "../helpers/providerUtils";
import { DeadlineScheduleMock } from "../../typechain-types"

describe("Schedule Modules Tests", () => {
    let schedule: DeadlineScheduleMock
    let blockTime: BigNumber

    const deploymentFixture = makeDeploymentFixture<DeadlineScheduleMock>("DeadlineScheduleMock")

    beforeEach(async () => {
        schedule = await waffle.loadFixture(deploymentFixture)
        blockTime = await currentTimestamp()
    })

    describe("Deadline Schedule Test", () => {
        it("Cannot be initialized with a deadline in the past", async () => {
            await expect(schedule.init(blockTime.sub(1), 1)).to.revertedWith(
                "INVALID_DEADLINE"
            )
        })
        it("Reports 0 entries when initialized", async () => {
            await (await schedule.init(blockTime.add(60), 10)).wait()
            expect(await schedule.entries()).to.equal(0)
        })
        describe("recordEntry()", () => {
            it("Cannot record an entry before the submission window", async () => {
                await (await schedule.init(blockTime.add(60), 10)).wait()
                await expect(schedule.recordEntry()).to.revertedWith(
                    "NOT_IN_SUBMISSION_WINDOW"
                )
            })
            it("Cannot record an entry after the deadline", async () => {
                await (await schedule.init(blockTime.add(2), 2)).wait()
                await advanceTime(60)
                await expect(schedule.recordEntry()).to.revertedWith(
                    "NOT_IN_SUBMISSION_WINDOW"
                )
            })
        })
        describe("missedDeadlines()", () => {
            it("Returns 0 before deadline", async () => {
                await (await schedule.init(blockTime.add(60), 10)).wait()
                expect(await schedule.missedDeadlines()).to.equal(0)
            })
            it("(after deadline) Returns 0 if a confirmation was submitted within the window", async () => {
                await (await schedule.init(blockTime.add(10), 10)).wait()
                await (await schedule.recordEntry()).wait()
                await advanceTime(60)
                expect(await schedule.missedDeadlines()).to.equal(0)
            })
            it("(after deadline) Returns 1 if no confirmation was submitted within the window", async () => {
                await (await schedule.init(blockTime.add(10), 10)).wait()
                await advanceTime(60)
                expect(await schedule.missedDeadlines()).to.equal(1)
            })
          }) 
    })
})