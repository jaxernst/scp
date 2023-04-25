import { expect } from "chai";
import { BigNumber } from "ethers";
import { deploy, deployTyped, makeDeploymentFixture } from "../helpers/deploy";
import {
  DAY,
  HOUR,
  WEEK,
  currentTimestamp,
  dayOfWeek,
  timeOfDay,
} from "../helpers/time";
import { advanceTime } from "../helpers/providerUtils";
import { AlarmScheduleMock, DeadlineScheduleMock } from "../../typechain-types";

describe("Alarm Schedule Test", () => {
  let schedule: AlarmScheduleMock;
  beforeEach(async () => {
    schedule = await deployTyped<AlarmScheduleMock>("AlarmScheduleMock");
  });

  it("Can only be initialized with a valid time of day and days array", async () => {
    await expect(schedule.init(86399, [1], 60, 0)).to.not.reverted;
    await expect(schedule.init(500, [1], 60, 0)).to.not.reverted;
    await expect(schedule.init(86400, [1], 60, 0)).to.revertedWith(
      "INVALID_ALARM_TIME"
    );

    await expect(schedule.init(1, [1], 60, 0)).to.not.reverted;
    await expect(schedule.init(1, [7], 60, 0)).to.not.reverted;
    await expect(schedule.init(1, [], 60, 0)).to.revertedWith("INVALID_DAYS");
    await expect(schedule.init(1, [0], 60, 0)).to.revertedWith("INVALID_DAYS");
    await expect(
      schedule.init(1, [1, 2, 3, 4, 5, 6, 7, 8], 60, 0)
    ).to.revertedWith("INVALID_DAYS");
    await expect(
      schedule.init(1, [1, 2, 4, 3, 5, 6, 7], 60, 0)
    ).to.revertedWith("INVALID_DAYS");
    await expect(schedule.init(1, [1, 2, 3, 4, 5, 6, 7], 60, 0)).to.not
      .reverted;
  });

  it("Reports 0 entries when initialized", async () => {
    await (await schedule.init(1, [1], 60, 0)).wait();
    expect(await schedule.entries()).to.equal(0);
  });

  describe("recordEntry()", () => {
    let blockTime: BigNumber;
    let curTimeOfDay: number;
    let weekDay: number;

    beforeEach(async () => {
      blockTime = await currentTimestamp();
      curTimeOfDay = timeOfDay(blockTime.toNumber());
      weekDay = dayOfWeek(blockTime.toNumber());
    });

    it("Only allows entries to be recorded when the block time is within submission window of an alarm time", async () => {
      // Init an alarm that will be due in 60 seconds (30 second submission window)
      await (
        await schedule.init(
          curTimeOfDay + 60,
          [weekDay, (weekDay + 1) % 7],
          30,
          0
        )
      ).wait();

      await expect(schedule.recordEntry()).to.revertedWith(
        "NOT_IN_SUBMISSION_WINDOW"
      );
      await advanceTime(30);
      await expect(schedule.recordEntry()).to.not.reverted;
      expect(await schedule.entries()).to.equal(1);
    });

    it("Prevents duplicate entries", async () => {
      await (
        await schedule.init(
          curTimeOfDay + 60,
          [weekDay, (weekDay + 1) % 7],
          60,
          0
        )
      ).wait();

      await expect(schedule.recordEntry()).to.not.reverted;
      await expect(schedule.recordEntry()).to.revertedWith(
        "ALREADY_SUBMITTED_TODAY"
      );
      expect(await schedule.entries()).to.equal(1);
      expect(await schedule.missedDeadlines()).to.equal(0);
    });

    it("Will not accept an entry on the same initialization day if alarm time has passed", async () => {
      const missedBySeconds = 60;

      await (
        await schedule.init(
          curTimeOfDay - missedBySeconds,
          [weekDay, (weekDay + 1) % 7],
          60,
          0
        )
      ).wait();

      await expect(schedule.recordEntry()).to.revertedWith(
        "NOT_IN_SUBMISSION_WINDOW"
      );
      expect(await schedule.entries()).to.equal(0);
      expect(await schedule.missedDeadlines()).to.equal(0);

      // Advance time by a little less than a week
      await advanceTime(WEEK - (missedBySeconds + 10));
      await expect(schedule.recordEntry()).to.not.reverted;
      expect(await schedule.entries()).to.equal(1);
    });

    it("Allows entries to be recorded when making a same day alarm within the submission window", async () => {
      await schedule.init(curTimeOfDay + 60, [1, 2, 3, 4, 5, 6, 7], 5000, 0);
      await schedule.recordEntry();
      await advanceTime(70);
      expect(await schedule.entries()).to.equal(1);
    });
  });
  describe("missedDeadlines()", () => {
    it("Returns 0 before deadline", async () => {});
    it("(after deadline) Returns 0 if a confirmation was submitted within the window", async () => {});
    it("(after deadline) Returns 1 if no confirmation was submitted within the window", async () => {});
  });
  describe("nextAlarmTime()", () => {
    let blockTime: number;
    let offset: number = 0;
    beforeEach(async () => {
      blockTime = (await currentTimestamp()).toNumber();
    });
    it("Returns the next alarm time with a same day alarm (before alarm time)", async () => {
      const currentDay = dayOfWeek(blockTime + offset);
      const curTimeOfDay = timeOfDay(blockTime, offset);
      await schedule.init(curTimeOfDay + 60, [currentDay], 60, offset);
      expect(await schedule._dayOfWeek(0)).to.equal(currentDay);
      expect(await schedule.timeToNextDeadline()).to.approximately(60, 3);
    });
    it("Returns the next alarm time for the next day", async () => {
      const currentDay = dayOfWeek(blockTime + offset);
      const curTimeOfDay = timeOfDay(blockTime, offset);
      await schedule.init(
        curTimeOfDay - 60,
        [currentDay, (currentDay + 1) % 7],
        60,
        offset
      );

      expect(await schedule.timeToNextDeadline()).to.approximately(
        1 * DAY - 60,
        3
      );
    });
    it("Returns the next alarm time on the next week", async () => {});
    it("Returns correct time when local timezone offset is used", async () => {
      const localOffset = new Date().getTimezoneOffset() * -60;
      const currentDay = dayOfWeek(blockTime + localOffset);
      const curTimeOfDay = timeOfDay(blockTime, localOffset);

      const expTimeTilNext = 4 * HOUR;
      await schedule.init(
        curTimeOfDay + expTimeTilNext,
        [currentDay, (currentDay + 1) % 7],
        60,
        localOffset
      );

      expect(await schedule.timeToNextDeadline()).to.approximately(
        expTimeTilNext,
        3
      );
    });
  });
});
