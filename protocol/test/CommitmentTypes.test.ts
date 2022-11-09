import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { createCommitment } from "../lib/commitmentCreation";
import { CommitStatus, CommitType } from "../lib/types";
import { CommitmentHub, ICommitment } from "../typechain-types";

describe("Commitment Initialization (All types)", () => {
  let commitmentHub: CommitmentHub;
  let user: SignerWithAddress;
  let genericCommit: ICommitment

  before(async () => {
    const deployer = await ethers.getContractFactory("CommitmentHub");
    commitmentHub = await deployer.deploy();
    [user] = await ethers.getSigners();
    
    genericCommit = await createCommitment(commitmentHub, CommitType.STANDARD, [""])
  });

  /* Todo:
   * Once more commitment type, these first few generalizeable commitment test cases
   * should be repeated for each commitment type
   */

  it("Sets the commitment owner as user who sent the commitment creation transaction", async () => {
    expect(await genericCommit.owner()).to.equal(user.address)
  })

  it("Set a commitment's status to active when initialized", async () => {
    expect(await genericCommit.status()).to.equal(CommitStatus.ACTIVE)
  });

  describe("Standard Commitments", async () => {

  })
});
