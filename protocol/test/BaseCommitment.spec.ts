import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { createCommitment } from "../lib/commitmentCreation";
import { CommitStatus } from "../lib/types";
import { BaseCommitment, CommitmentHub } from "../typechain-types";
import { Contract } from "ethers";

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
      "BaseCommitment", 
      { name: "Name", description: "Description" }
    );
  });
  
  describe("Commitment Type: Base Commitment", () => {
    it("Sets the commitment name and description as specified by the user when creating commitment", async () => {
      const commit = await createCommitment(
        hub, "BaseCommitment", { name: "TestName", description: "TestDescription" }
      );
      expect(await commit.name()).to.equal("TestName");
      // ToDo: read event history for this check
      // expect(await commit.commitmentDescription()).to.equal("TestDescription");
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

    const expectCompleted = async (commit: Contract, func: any) => {
      await expect(func())
        .to.emit(commit, "StatusChanged").withArgs(CommitStatus.ACTIVE, CommitStatus.COMPLETE)
        expect(await commit.status()).to.equal(CommitStatus.COMPLETE)
    }

    it("Sets the commitment status to complete after submitting a confirmation", async () => {
      const commit1 = await createCommitment(hub, "BaseCommitment", { name: "", description: ""})
      await expectCompleted(commit1, commit1.submitConfirmation)
      const commit2 = await createCommitment(hub, "BaseCommitment", { name: "", description: ""})
      await expectCompleted(commit2, () => commit2.submitConfirmationWithProof(''))
    })
  });
});
