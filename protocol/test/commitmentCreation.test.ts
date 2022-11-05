import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CommitmentHub } from "../typechain-types";

describe("Standard Commitment Creation", () => {
  let commitmentHub: CommitmentHub;
  let user: SignerWithAddress;

  before(async () => {
    const deployer = await ethers.getContractFactory("CommitmentHub");
    commitmentHub = await deployer.deploy();
    [user] = await ethers.getSigners();
  });

  it("Set a commitments status to active when initialized");
});
