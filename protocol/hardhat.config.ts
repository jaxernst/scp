import { HardhatUserConfig } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';
import '@nomicfoundation/hardhat-chai-matchers';
import 'hardhat-abi-exporter'
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  abiExporter: [
    {
      runOnCompile: true,
      path: '../interface/src/abi',
      format: "json",
      flat: true,
      only: [
        "CommitmentHub.sol",
        "TimelockingDeadlineTask.sol",
        "BaseCommitment.sol"
      ]
    },
  ]
};

export default config;
