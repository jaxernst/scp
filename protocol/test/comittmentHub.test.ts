import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { textSpanContainsPosition } from "typescript";
import { CommitmentHub } from "../typechain-types";

describe("CommitmentHub: Creating Commitments", () => {
  let commitmentHub: CommitmentHub;
  let user: SignerWithAddress;

  before(async () => {
    [user] = await ethers.getSigners();
  });

  beforeEach(async () => {
    commitmentHub = await (await ethers.getContractFactory("CommitmentHub")).deploy()
  });

  it("Records commitment addresses indexed by an incrementing id", async () => {
    const startingId = await commitmentHub.nextCommitmentId()
    const tx = commitmentHub.createStandardCommitment("")
    await expect(tx).to.not.be.reverted
    expect(await commitmentHub.commitments(startingId)).to.be.properAddress
    expect(await commitmentHub.nextCommitmentId()).to.eq(startingId.add(1))
  });

  it("Reduces commitment deployment gas costs with a minimal proxy", async () => {
    const tx1 = await commitmentHub.createStandardCommitment("")
    const tx2 = await commitmentHub.createStandardCommitment("")
    const rc1 = await tx1.wait()
    const rc2 = await tx2.wait()
    console.log(Number(rc1.gasUsed), Number(rc2.gasUsed))
    expect(rc1.gasUsed).to.gt(rc2.gasUsed)
  });
});
