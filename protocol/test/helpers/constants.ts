import { ethers } from "hardhat";

export const encodedString = ethers.utils.defaultAbiCoder.encode(["string"], [""])
export const ZERO_ADDRESS = ethers.constants.AddressZero
