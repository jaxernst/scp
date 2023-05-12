import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  encodeCreationParams,
  registerNewType,
} from "../lib/commitmentCreation";
import { commitmentTypeVals } from "../lib/types";
import { BaseCommitment, CommitmentHub } from "../typechain-types";
import { ZERO_ADDRESS } from "./helpers/constants";
import { deploy, deployTyped } from "./helpers/deploy";
import { waitAll, repeat } from "./helpers/util";

describe("CommitmentHub", () => {
  let commitmentHub: CommitmentHub;
  let commitment: BaseCommitment;
  let owner: SignerWithAddress;
  let rando: SignerWithAddress;

  before(async () => {
    [owner, rando] = await ethers.getSigners();
  });

  beforeEach(async () => {
    commitmentHub = await (
      await ethers.getContractFactory("CommitmentHub")
    ).deploy();
    commitment = await deployTyped<BaseCommitment>("BaseCommitment");
  });

  describe("Commitment Type Registration", () => {
    it("Cannot create a commitment without a registered template contract", async () => {
      const initData = encodeCreationParams("BaseCommitment", {
        name: "",
        description: "",
      });
      await expect(
        commitmentHub.createCommitment(
          commitmentTypeVals["BaseCommitment"],
          initData
        )
      ).to.revertedWith("TYPE_NOT_REGISTERED");

      await (
        await commitmentHub.registerCommitType(
          commitmentTypeVals["BaseCommitment"],
          commitment.address
        )
      ).wait();

      await expect(
        commitmentHub.createCommitment(
          commitmentTypeVals["BaseCommitment"],
          initData
        )
      ).to.not.reverted;
    });

    it("Only allows templates to be registered by the owner", async () => {
      await expect(
        commitmentHub
          .connect(rando)
          .registerCommitType(
            commitmentTypeVals["BaseCommitment"],
            commitment.address
          )
      ).to.be.reverted;
      await expect(
        commitmentHub.registerCommitType(
          commitmentTypeVals["BaseCommitment"],
          commitment.address
        )
      ).to.not.be.reverted;
    });

    it("Prevents overriding commitment type registration", async () => {
      await commitmentHub.registerCommitType(
        commitmentTypeVals["BaseCommitment"],
        commitment.address
      );
      const commitment2 = await deploy("BaseCommitment");
      await expect(
        commitmentHub.registerCommitType(
          commitmentTypeVals["BaseCommitment"],
          commitment2.address
        )
      ).to.be.revertedWith("TYPE_REGISTERED");
    });
  });

  describe("Commitment Creation (minimal proxy cloning)", () => {
    const baseInitData = encodeCreationParams("BaseCommitment", {
      name: "",
      description: "",
    });

    // Register commitment types to be tested
    beforeEach(async () => {
      const commitment = await deploy("BaseCommitment");
      await registerNewType(commitmentHub, "BaseCommitment");
    });

    it("Creates commitments from registered template contracts", async () => {
      // Type 0 commitment (standard commitment)
      expect(
        await commitmentHub.commitmentRegistry(
          commitmentTypeVals["BaseCommitment"]
        )
      ).to.not.equal(ZERO_ADDRESS);

      const tx = commitmentHub.createCommitment(
        commitmentTypeVals["BaseCommitment"],
        baseInitData
      );
      await expect(tx).to.not.reverted;
    });

    it("Emits CommitmentCreation events", async () => {
      const tx = commitmentHub.createCommitment(
        commitmentTypeVals["BaseCommitment"],
        baseInitData
      );
      await expect(tx).to.emit(commitmentHub, "CommitmentCreation");
    });

    it("Allows all user commitments to be retrieved by querying events", async () => {
      const txs = await repeat(
        commitmentHub.createCommitment,
        [commitmentTypeVals["BaseCommitment"], baseInitData],
        5
      );
      await waitAll(txs);
      const events = await commitmentHub.queryFilter(
        commitmentHub.filters.CommitmentCreation(owner.address as any)
      );
      expect(events.length).to.equal(5);
    });

    it("Records commitment addresses indexed by an incrementing id", async () => {
      const startingId = await commitmentHub.nextCommitmentId();
      const tx = commitmentHub.createCommitment(
        commitmentTypeVals["BaseCommitment"],
        baseInitData
      );

      await expect(tx).to.not.be.reverted;
      expect(await commitmentHub.commitments(startingId)).to.be.properAddress;
      expect(await commitmentHub.nextCommitmentId()).to.eq(startingId.add(1));
    });
  });
});
