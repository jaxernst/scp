import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { isExportDeclaration } from "typescript";
import { createCommitment } from "../lib/commitmentCreation";
import { CommitStatus, CommitType } from "../lib/types";
import { Commitment, CommitmentHub } from "../typechain-types";
import { BaseCommitment, DeadlineCommitment } from "../typechain-types/contracts/commitment-types";
import { advanceTime } from "./helpers/providerUtils";
import { currentTimestamp, fromNow } from "./helpers/time";

describe("Commitment Spec Test", () => {
  let hub: CommitmentHub;
  let user: SignerWithAddress;
  let genericCommit: BaseCommitment;

  before(async () => {
    const deployer = await ethers.getContractFactory("CommitmentHub");
    hub = await deployer.deploy();
    [user] = await ethers.getSigners();
    genericCommit = await createCommitment(hub, CommitType.BASE, "name", [""]);
  });

  it("Sets the commitment name as specified by the user when creating commitment", async () => {
    const commit = await createCommitment(hub, CommitType.BASE, "TestName", [
      "",
    ]);
    expect(await commit.name()).to.equal("TestName");
  });

  it("Sets the commitment owner as the user who sent the commitment creation transaction", async () => {
    expect(await genericCommit.owner()).to.equal(user.address);
  });

  it("Cannot be re-initialized after being created through the hub", async () => {
    expect(genericCommit.init("name", "0x234")).to.revertedWith(
      "ALREADY_INITIALIZED"
    );
  });

  it("Set a commitment's status to active when initialized", async () => {
    expect(await genericCommit.status()).to.equal(CommitStatus.ACTIVE);
  });

  it("Cannot be marked complete with a direct call to markComplete()", async () => {
    expect(Object.values(genericCommit.functions)).to.not.include("_markComplete")
  })

  describe("Commitment Type: Base Commitment", () => {
    it("Sets the commitment description as specified by the user", async () => {
      const commitment = await createCommitment(hub, CommitType.BASE, "", [
        "Description",
      ]);
      expect(await commitment.description()).to.equal("Description");
    });
  });

  describe("Commitment type: Deadline", async () => {
    it("Sets the commitment name and description as specified by the user", async () => {
      const commitment = await createCommitment(
        hub,
        CommitType.DEADLINE,
        "Name",
        ["Description", await fromNow(60), await fromNow(60)]
      );

      expect(await commitment.name()).to.equal("Name");
      expect(await commitment.description()).to.equal("Description");
    });

    it("Cannot be initialized with a deadline in the past", async () => {
      await expect(
        createCommitment(hub, CommitType.DEADLINE, "", ["", 0, 0])
      ).to.revertedWith("DEADLINE_PASSED");
    });

    describe("submitConfirmation()", () => {
      it("Cannot submit a confirmation before the submission window", async () => {
        const commit = await createCommitment(hub, CommitType.DEADLINE, "", [
          "",
          await fromNow(60),
          1,
        ]);
        await expect(commit.submitConfirmation()).to.revertedWith(
          "NOT_IN_WINDOW"
        );
      });

      it("Cannot submit a confirmation after the deadline", async () => {
        const commit = await createCommitment(hub, CommitType.DEADLINE, "", [
          "",
          await fromNow(500),
          1,
        ]);
        await advanceTime(501);
        await expect(commit.submitConfirmation()).to.revertedWith(
          "DEADLINE_MISSED"
        );
      });

      it("Gets marked as complete if a confirmation is submitted within the window", async () => {
        const commit = await createCommitment(
          hub,
          CommitType.DEADLINE,
          "Name",
          ["Description", await fromNow(60), await fromNow(60)]
        );
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
        commitment = await createCommitment(hub, CommitType.DEADLINE, "", 
          ["", await fromNow(deadline), submissionWindow]
        )
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
});
