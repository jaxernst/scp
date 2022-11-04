import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { textSpanContainsPosition } from "typescript";
import { CommitmentHub } from "../typechain-types";
import { deploy } from "./utils/deploy";

describe("CommitmentHub", () => {
  let commitmentHub: CommitmentHub;
  let user: SignerWithAddress;

  before(async () => {
    [user] = await ethers.getSigners();
  });

  beforeEach(async () => {
    commitmentHub = await (await ethers.getContractFactory("CommitmentHub")).deploy()
  });

  describe("Commitment Type registration", () => {
    it("Cannot create a commitment without a registered template contract", async () => {
      await expect(commitmentHub.createStandardCommitment("")).to.revertedWith("Type Not Registered")
      
      const commitment = await deploy("StandardCommitment")
      await (await (commitmentHub.registerType(0, commitment.address))).wait()
      await expect(commitmentHub.createStandardCommitment("")).to.not.reverted
    })
    it("Only allows templates to be registered by the owner")
    it("Prevents re-registration of the same type")

  })

  beforeEach(async () => {
    commitmentHub = await (await ethers.getContractFactory("CommitmentHub")).deploy()
  });

  describe("Commitment Creation", () => {
    // Register commitment types to be tested
    beforeEach(async () => {
      const commitment = await deploy("StandardCommitment")
      await (await (commitmentHub.registerType(0, commitment.address))).wait()
    })
    
    it("Can create commitments from registered template contracts", async () => {
      // Type 0 commitment (standard commitment) 
      expect(await commitmentHub.templateRegistry(0))
      await expect(commitmentHub.createStandardCommitment("")).to.not.reverted
      
      // Check create event was emitted
      
    })

    it("Sets the commitment owner as user who sent the commitment creation transaction", () => {
      
    })
  
    it("Records commitment addresses indexed by an incrementing id", async () => {
      const startingId = await commitmentHub.nextCommitmentId()
      const tx = commitmentHub.createStandardCommitment("")
      await expect(tx).to.not.be.reverted
      expect(await commitmentHub.commitments(startingId)).to.be.properAddress
      expect(await commitmentHub.nextCommitmentId()).to.eq(startingId.add(1))
    });
  })
});
