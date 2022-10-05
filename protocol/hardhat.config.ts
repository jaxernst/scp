import { HardhatUserConfig } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
};

export default config;
