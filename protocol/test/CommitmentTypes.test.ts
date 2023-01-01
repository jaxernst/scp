import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish } from "ethers";
import { AbiCoder } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { isExportDeclaration } from "typescript";
import { createCommitment, registerNewType } from "../lib/commitmentCreation";
import { CommitStatus, CommitType, CommitTypeVals, DayOfWeek, InitializationTypes, ScheduleType, SolidityCommitInitTypes } from "../lib/types";
import { BaseCommitment, CommitmentHub, DeadlineCommitment } from "../typechain-types";
import { maxUint } from "./helpers/numbers";
import { advanceTime } from "./helpers/providerUtils";
import { currentTimestamp, DAY, fromNow, HOUR, secondsSinceMidnight, SECONDS_PER_DAY, systemTimestamp, timeOfDaySeconds, WEEK } from "./helpers/time";

describe("Commitment Spec Test", () => {
  let hub: CommitmentHub;
  let user: SignerWithAddress;
  let genericCommit: BaseCommitment;

  before(async () => {
    const deployer = await ethers.getContractFactory("CommitmentHub");
    hub = await deployer.deploy();
    [user] = await ethers.getSigners();
    genericCommit = await createCommitment(
      hub, 
      CommitType.BASE, 
      { name: "Name", description: "Description" }
    );
  });
  
  describe("Commitment Type: Base Commitment", () => {
    it("Sets the commitment name and description as specified by the user when creating commitment", async () => {
      const commit = await createCommitment(
        hub, CommitType.BASE, { name: "TestName", description: "TestDescription" }
      );
      expect(await commit.name()).to.equal("TestName");
      expect(await commit.commitmentDescription()).to.equal("TestDescription");
    });

    it("Sets the base commitment's owner as the user who sent the commitment creation transaction", async () => {
      expect(await genericCommit.owner()).to.equal(user.address);
    });

    it("Cannot be re-initialized after being created through the hub", async () => {
      expect(genericCommit.init("0x234"))
        .to.revertedWith("ALREADY_INITIALIZED");
    });

    it("Sets the base commitment's status to active when initialized", async () => {
      expect(await genericCommit.status()).to.equal(CommitStatus.ACTIVE);
    });
  });

  describe("Commitment Type: Deadline", async () => {
    let genericCommit: DeadlineCommitment
    before(async () => {
      genericCommit = await createCommitment(hub, CommitType.DEADLINE, {
        deadline: maxUint(256), submissionWindow: 60, name: "", description: "", 
      })
    })

    describe("Initialization", () => {
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
        expect(await commitment.commitmentDescription()).to.equal("Description");
      });

      it("Cannot be initialized with a deadline in the past", async () => {
        await expect(
          createCommitment(hub, CommitType.DEADLINE, 
            { deadline: 0, submissionWindow: 0, name: "", description: "" }
          )
        ).to.revertedWith("DEADLINE_PASSED");
      });
    })

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
    }) 
  });

  describe("Commitment Type: Alarm", async () => {
    const encodeParams = (
      alarmTime: BigNumberish, 
      submissionWindow: BigNumberish, 
      timezoneOffset: BigNumberish,
      daysActive: number[]
    ) => ethers.utils.defaultAbiCoder.encode(
      SolidityCommitInitTypes[CommitType.ALARM],
      [alarmTime, submissionWindow, timezoneOffset, daysActive]
    )

    const ALL_DAYS = [1, 2, 3, 4, 5, 6, 7] as DayOfWeek[]

    before(async () => {
      await registerNewType(hub, "AlarmCommitment", CommitType.ALARM)
    })

    describe("Initialization", async () => {
      it("Sets the schedule type to ScheduleType.ALARM", async () => {
        const commit = await createCommitment(hub, CommitType.ALARM, {
          alarmTime: 0, submissionWindow: 60, timezoneOffset: 0, daysActive: [1]
        })
        expect(await commit.scheduleType()).to.eq(ScheduleType.ALARM)
      })
      
      it("Requires an alarm time in seconds in range [0, 86400)", async () => {
        // Invalid Alarm times
        for (let x of [86400, 86401, 100000000]) {
          await expect(
            hub.createCommitment(CommitType.ALARM, encodeParams(x, 3600, 0, [1])
          )).to.revertedWith("INVALID_ALARM_TIME")
        }
        // Valid alarm times
        for (let x of [0, 34928, 86399]) {
          await expect(
            hub.createCommitment(CommitType.ALARM, encodeParams(x, 3600, 0, [1])
          )).to.not.reverted
        }
      })
      it("Requires a submission window in range [60, 86400)", async () => {
        // Invalid submission windows
        for (let x of [59, 0, 86400, 86401]) {
          await expect(
            hub.createCommitment(CommitType.ALARM, encodeParams(500, x, 0, [1])
          )).to.revertedWith("INVALID_WINDOW")
        }
        // Valid submission windows
        for (let x of [60, 86399, 500]) {
          await expect(
            hub.createCommitment(CommitType.ALARM, encodeParams(500, x, 0, [1])
          )).to.not.reverted
        }
      })
      it("Requires an activeDays array with length [1-7] and values in range [1,7]", async () => {
        // Invalid activeDays arrays
        for (let x of [[], [0], [0,1,2,3,4,5,6], [1,2,3,4,5,6,7,8], [8], [123]]) {
          await expect(
            hub.createCommitment(CommitType.ALARM, encodeParams(500, 60, 0, x)
          )).to.revertedWith("INVALID_DAYS")
        }
        // Valid submission windows
        for (let x of [[1], [7], [1,2,3], [7,3,1], [1,2,3,4,5,6,7]]) {
          await expect(
            hub.createCommitment(CommitType.ALARM, encodeParams(500, 60, 0, x)
          )).to.not.reverted
        }
      })
      it("Requries a timezone in the range (-43200, 43200)", async () => {
        // Invalid activeDays arrays
        for (let x of [-43200, 43200, -43201, 50000000]) {
          await expect(
            hub.createCommitment(CommitType.ALARM, encodeParams(500, 60, x, [1])
          )).to.revertedWith("INVALID_TIMEZONE")
        }
        // Valid submission windows
        for (let x of [0]) {
          await expect(
            hub.createCommitment(CommitType.ALARM, encodeParams(500, 60, x, [1])
          )).to.not.reverted
        }
      })
    })

    describe("Activation/Deactivation", async () => {
      it("Sets the status to active after initialization", async () => {
        const commit = await createCommitment(hub, CommitType.ALARM, {
          alarmTime: 0, submissionWindow: 60, timezoneOffset: 0, daysActive: [1]
        })
        expect(await commit.status()).to.eq(CommitStatus.ACTIVE)
      })

      it("Enforces the alarm same day of initialization if alarm time hasn't passed today", async () => {
        const tzOffset = -8
        let chainTime = Number(await currentTimestamp())
        let chainTimeOfDay = timeOfDaySeconds(chainTime, tzOffset)
        let alarmTime = (chainTimeOfDay + 60) % SECONDS_PER_DAY
        
        // First, make sure there is > 100 seconds to midnight (edge case invalidates test case)
        if ((SECONDS_PER_DAY - chainTimeOfDay) <= 100) {
          await advanceTime(23 * HOUR)
          chainTime = Number(await currentTimestamp())
          chainTimeOfDay = timeOfDaySeconds(chainTime, tzOffset)
          alarmTime = (chainTimeOfDay + 60) % SECONDS_PER_DAY
        }

        const commit = await createCommitment(hub, CommitType.ALARM, {
          alarmTime, 
          submissionWindow: 60, 
          timezoneOffset: tzOffset * 3600, 
          daysActive: ALL_DAYS
        })

        expect(await commit.missedDeadlines()).to.eq(0)
        await advanceTime(100)
        expect(await commit.missedDeadlines()).to.eq(1)
      })

      it("Does not report a missed alarm after creation if the alarm time has passed on the day of creation", async () => {
        const tzOffset = -8
        let chainTime = Number(await currentTimestamp())
        let chainTimeOfDay = timeOfDaySeconds(chainTime, tzOffset)
        let alarmTime = (chainTimeOfDay - 1000) % SECONDS_PER_DAY

        const commit = await createCommitment(hub, CommitType.ALARM, {
          alarmTime, 
          submissionWindow: 60, 
          timezoneOffset: tzOffset * 3600, 
          daysActive: ALL_DAYS
        })

        expect(await commit.missedDeadlines()).to.eq(0)
        await advanceTime(DAY)
        expect(await commit.missedDeadlines()).to.eq(1)
      })
    })
    describe("Confirmation Submission", async () => {
      it("Does not allow confirmations to be submitted outside the submission window")
      it("Allows confimrations to be submitted within the submission window")
    })
    describe("Missed Confirmation Tracking", async () => {
      it("TC1", async () => {
        const ts = systemTimestamp()
        const tsFuture = ts + 2*WEEK
        console.log(calculate_num_activations(
          ts + 60,
          [1, 2],
          ts,
          tsFuture
        ))
      })
    })
  })
});


function calculate_num_activations(
  alarm_time: number, 
  days: number[], 
  init_timestamp: number, 
  current_timestamp: number
) {
  // Calculate the number of seconds in a day
  const seconds_in_day = 24 * 60 * 60

  // Calculate the number of days between the initial and current timestamps
  const num_days = Math.floor((current_timestamp - init_timestamp) / seconds_in_day)

  // Calculate the day of the week for the initial timestamp
  let _days = Math.floor(init_timestamp / SECONDS_PER_DAY)
  const init_day_of_week = ((_days + 3) % 7) + 1;

  // Calculate the day of the week for the current timestamp
  _days = Math.floor(current_timestamp / SECONDS_PER_DAY)
  const current_day_of_week = ((_days + 3) % 7) + 1;

  // Initialize the count of activations to 0
  let activations = 0

  // If the initial day is in the list of days to activate the alarm, increment the activation count
  if (days.includes(init_day_of_week)) {
    activations += 1
  }

  // Calculate the number of days between the initial and current days, ignoring the initial and current days
  const num_days_between = (num_days - 1) % 7

  // Calculate the number of activations based on the number of days between the initial and current days
  // and the days of the week to activate the alarm
  activations += Math.floor(num_days_between / days.length)

  // If the current day is in the list of days to activate the alarm and the current timestamp is after the alarm time,
  // increment the activation count
  if (days.includes(current_day_of_week) && 
    current_timestamp  >= init_timestamp + (alarm_time + num_days * seconds_in_day)
  ) {
    activations += 1
  }

  return activations
}