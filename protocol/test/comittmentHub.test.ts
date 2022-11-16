import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CommitType } from "../lib/types";
import { CommitmentHub } from "../typechain-types";
import { encodedString, ZERO_ADDRESS } from "./helpers/constants";
import { deploy } from "./helpers/deploy";



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
      await expect(commitmentHub.createCommitment(0, "", "", encodedString)).to.revertedWith("Type Not Registered")
      const commitment = await deploy("BaseCommitment")
      await (await (commitmentHub.registerCommitType(0, commitment.address))).wait()
      await expect(commitmentHub.createCommitment(0, "", "", encodedString)).to.not.reverted
    })

    it("Only allows templates to be registered by the owner")

    it("Prevents re-registration of the same commit type")

    it("Emits an event with the uri to the proof upon confimation")

  })


  describe("Commitment Creation", () => {
    // Register commitment types to be tested
    beforeEach(async () => {
      const commitment = await deploy("BaseCommitment")
      await (await (commitmentHub.registerCommitType(0, commitment.address))).wait()
    })
    
    it("Creates commitments from registered template contracts", async () => {
      // Type 0 commitment (standard commitment) 
      expect(
        await commitmentHub.commitTemplateRegistry(CommitType.BASE)
      ).to.not.equal(ZERO_ADDRESS)
      const tx = commitmentHub.createCommitment(CommitType.BASE, "name", "", encodedString)
      await expect(tx).to.not.reverted
    })

    it("Emits CommitmentCreation events", async () => {
      const tx = commitmentHub.createCommitment(CommitType.BASE, "name", "", encodedString)
      await expect(tx).to.emit(commitmentHub, "CommitmentCreation")
    })

    it("Allows all user commitments to be retrieved by querying events", async () => {
      const txs = await repeat(commitmentHub.createCommitment, [0, "name", "", encodedString], 5)
      await waitAll(txs)
      const events = await commitmentHub.queryFilter(
        commitmentHub.filters.CommitmentCreation(user.address as any)
      )
      expect(events.length).to.equal(5)
    })

    it("Records commitment addresses indexed by an incrementing id", async () => {
      const startingId = await commitmentHub.nextCommitmentId()
      const tx = commitmentHub.createCommitment(0, "", "", encodedString)
      await expect(tx).to.not.be.reverted
      expect(await commitmentHub.commitments(startingId)).to.be.properAddress
      expect(await commitmentHub.nextCommitmentId()).to.eq(startingId.add(1))
    });
  })

});



async function repeat(func: CallableFunction, args: any[], times: number): Promise<any[]> {
  const out = [];
  for (let i = 0; i < times; i++) {
    out.push(await (func as any)(...args));
  }
  return out;
}

const waitAll = async (txs: any[]) => {
  for (const tx of txs) {
    await tx.wait();
  }
};

