import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CommitmentHub, ICommitment, ICommitment__factory } from "../typechain-types";
import { deploy } from "./utils/deploy";

enum CommitmentType {
  STANDARD,
}

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


  describe("Commitment Creation", () => {
    // Register commitment types to be tested
    beforeEach(async () => {
      const commitment = await deploy("StandardCommitment")
      await (await (commitmentHub.registerType(0, commitment.address))).wait()
    })
    
    it("Creates commitments from registered template contracts", async () => {
      // Type 0 commitment (standard commitment) 
      expect(await commitmentHub.templateRegistry(0))
      const tx = commitmentHub.createStandardCommitment("")
      await expect(tx).to.not.reverted
    })

    it("Emits CommitmentCreation events", async () => {
      const tx = commitmentHub.createStandardCommitment("")
      await expect(tx).to.emit(commitmentHub, "CommitmentCreation")
    })

    it("Allows all user commitments to be retrieved by querying events", async () => {
      const txs = await repeat(commitmentHub.createStandardCommitment, [""], 5)
      await waitAll(txs)
      const events = await commitmentHub.queryFilter(
        commitmentHub.filters.CommitmentCreation(user.address as any)
      )

      expect(events.length).to.equal(5)
    })

    it("Sets the commitment owner as user who sent the commitment creation transaction", async () => {
      const commitment = await createAndFetchCommitment(commitmentHub, 0)
      expect(await commitment.owner()).to.equal(user.address)
    })
  
    it("Records commitment addresses indexed by an incrementing id", async () => {
      const startingId = await commitmentHub.nextCommitmentId()
      const tx = commitmentHub.createStandardCommitment("")
      await expect(tx).to.not.be.reverted
      expect(await commitmentHub.commitments(startingId)).to.be.properAddress
      expect(await commitmentHub.nextCommitmentId()).to.eq(startingId.add(1))
    });
  })

  describe("Commitment Initialization", () => {

  })
});

async function createAndFetchCommitment(
  hub: CommitmentHub, 
  type: CommitmentType
): Promise<ICommitment> {
  const rc = await (await hub.createCommitment(type)).wait()
  if (!rc.events) throw Error("No events found in tx")
  
  let commitAddr: string
  for (const event of rc.events) {
    if (event.event && event.event == "CommitmentCreation") {
      commitAddr = event.args!.commitmentAddr
    }
  }

  console.log("Commit addr", commitAddr!)
  return ICommitment__factory.connect(commitAddr!, hub.signer)
}

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

