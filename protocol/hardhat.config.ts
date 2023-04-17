import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-abi-exporter";
import "@typechain/hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("automine", "Turn automine off or on")
  .addFlag("off")
  .addFlag("on")
  .addOptionalParam("interval")
  .setAction(
    async (
      args: { off: boolean; on: boolean; interval: string | undefined },
      hre: HardhatRuntimeEnvironment
    ) => {
      if (args.on && args.off) {
        throw "select only off or on.";
      }
      if (!args.on && !args.off) {
        throw "select either --on or --off";
      }

      if (args.on) {
        await hre.ethers.provider.send("evm_setAutomine", [true]);
      } else {
        await hre.ethers.provider.send("evm_setAutomine", [false]);
      }
      await hre.ethers.provider.send("evm_setIntervalMining", [
        args.interval ? Number(args.interval) : 5000,
      ]);
    }
  );

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {},
  abiExporter: [
    {
      runOnCompile: true,
      path: "../sdk/abi",
      format: "json",
      flat: true,
      only: [
        "CommitmentHub.sol",
        "TimelockingDeadlineTask.sol",
        "PartnerAlarmClock.sol",
        "BaseCommitment.sol",
      ],
    },
  ],
};

export default config;
