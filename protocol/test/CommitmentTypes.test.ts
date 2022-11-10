import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { createCommitment } from "../lib/commitmentCreation";
import { CommitStatus, CommitType } from "../lib/types";
import { Commitment, CommitmentHub, StandardCommitment } from "../typechain-types";

describe("Commitment Initialization (All types)", () => {
  let hub: CommitmentHub;
  let user: SignerWithAddress;
  let genericCommit: Commitment

  before(async () => {
    const deployer = await ethers.getContractFactory("CommitmentHub");
    hub = await deployer.deploy();
    [user] = await ethers.getSigners();
    
    genericCommit = await createCommitment(hub, CommitType.STANDARD, ["", ""])
  });

  it("Sets the commitment owner as user who sent the commitment creation transaction", async () => {
    expect(await genericCommit.owner()).to.equal(user.address)
  })

  it("Cannot be re-initialized after being created through the hub", async () => {
    expect(genericCommit.init("0x234")).to.revertedWith("ALREADY_INITIALIZED")
  })

  it("Set a commitment's status to active when initialized", async () => {
    expect(await genericCommit.status()).to.equal(CommitStatus.ACTIVE)
  });

  describe("Commitment type: Standard", async () => {
    it("Sets the commitment name and description as specified by the user", async () => {
      const commitment = await createCommitment(hub, 0, ["Name", "Description"])
      expect(await commitment.name()).to.equal("Name")
      expect(await commitment.description()).to.equal("Description")
    })
  })

  describe("Commitment type: Deadline", async () => {
    it("Sets the commitment name and description as specified by the user", async () => {
      const commitment = await createCommitment(hub, 0, ["Name", "Description"])
      expect(await commitment.name()).to.equal("Name")
      expect(await commitment.description()).to.equal("Description")
    })
  })
});
