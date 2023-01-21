import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { encodeCreationParams, registerNewType } from "../lib/commitmentCreation";
import { commitmentTypeVals } from "../lib/types";
import { Commitment, CommitmentHub } from "../typechain-types";
import { ZERO_ADDRESS } from "./helpers/constants";
import { deploy, deployTyped } from "./helpers/deploy";
import { waitAll, repeat } from "./helpers/util"


describe("CommitmentHub", () => {
  let commitmentHub: CommitmentHub;
  let user: SignerWithAddress;

  before(async () => {
    [user] = await ethers.getSigners();
  });

  beforeEach(async () => {
    commitmentHub = await (await ethers.getContractFactory("CommitmentHub")).deploy()
  });

  describe("Commitment Type Registration", () => {
    it("Cannot create a commitment without a registered template contract", async () => {
      const initData = encodeCreationParams("BaseCommitment", { name: "", description: ""})
      await expect(commitmentHub.createCommitment(commitmentTypeVals["BaseCommitment"], initData))
        .to.revertedWith("Type Not Registered")
      
      const commitment = await deployTyped<Commitment>("BaseCommitment")
      await (await (commitmentHub.registerCommitType(
        commitmentTypeVals["BaseCommitment"], 
        commitment.address
      ))).wait()

      await expect(commitmentHub.createCommitment(commitmentTypeVals["BaseCommitment"], initData))
        .to.not.reverted
    })

    it("Only allows templates to be registered by the owner")

    it("Prevents re-registration of the same commit type")

    it("Emits an event with the uri to the proof upon confimation")

  })


  describe("Commitment Creation (minimal proxy cloning)", () => {
    const baseInitData = encodeCreationParams(
      "BaseCommitment", 
      { name: "", description: ""}
    )

    // Register commitment types to be tested
    beforeEach(async () => {
      const commitment = await deploy("BaseCommitment")
      await registerNewType(commitmentHub, "BaseCommitment")
    })
    
    it("Creates commitments from registered template contracts", async () => {
      // Type 0 commitment (standard commitment) 
      expect(
        await commitmentHub.commitTemplateRegistry(commitmentTypeVals["BaseCommitment"])
      ).to.not.equal(ZERO_ADDRESS)

      const tx = commitmentHub.createCommitment(commitmentTypeVals["BaseCommitment"], baseInitData)
      await expect(tx).to.not.reverted
    })

    it("Emits CommitmentCreation events", async () => {
      const tx = commitmentHub.createCommitment(commitmentTypeVals["BaseCommitment"], baseInitData)
      await expect(tx).to.emit(commitmentHub, "CommitmentCreation")
    })

    it("Allows all user commitments to be retrieved by querying events", async () => {
      const txs = await repeat(commitmentHub.createCommitment, [commitmentTypeVals["BaseCommitment"], baseInitData], 5)
      await waitAll(txs)
      const events = await commitmentHub.queryFilter(
        commitmentHub.filters.CommitmentCreation(user.address as any)
      )
      expect(events.length).to.equal(5)
    })

    it("Records commitment addresses indexed by an incrementing id", async () => {
      const startingId = await commitmentHub.nextCommitmentId()
      const tx = commitmentHub.createCommitment(commitmentTypeVals["BaseCommitment"], baseInitData)
      
      await expect(tx).to.not.be.reverted
      expect(await commitmentHub.commitments(startingId)).to.be.properAddress
      expect(await commitmentHub.nextCommitmentId()).to.eq(startingId.add(1))
    });
  })
});





