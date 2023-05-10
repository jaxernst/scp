import { BigNumberish, Contract, ethers } from "ethers";
import { deploy } from "../test/helpers/deploy";
import { CommitmentHub } from "../typechain-types";
import {
  CommitmentType,
  CommitmentContractTypes,
  commitmentTypeVals,
  InitializationTypes,
  commitmentFactories,
  solidityInitializationTypes,
} from "./types";

export async function createCommitment<T extends CommitmentType>(
  hub: CommitmentHub,
  name: T,
  initData: InitializationTypes[T],
  value?: BigNumberish
): Promise<CommitmentContractTypes[T]> {
  if (
    (await hub.commitmentRegistry(commitmentTypeVals[name])) ===
    ethers.constants.AddressZero
  ) {
    await registerNewType(hub, name);
  }

  const byteData = encodeCreationParams(name, initData);
  const rc = await (
    await hub.createCommitment(commitmentTypeVals[name], byteData, {
      value: value ? value : 0,
    })
  ).wait();

  if (!rc.events) throw Error("No events found in tx");

  let commitAddr: string;
  for (const event of rc.events) {
    if (event.event && event.event == "CommitmentCreation") {
      commitAddr = event.args!.commitmentAddr;
    }
  }

  return (commitmentFactories[name] as any).connect(commitAddr!, hub.signer);
}

export function encodeCreationParams<T extends CommitmentType>(
  name: T,
  initData: InitializationTypes[T]
): string {
  return ethers.utils.defaultAbiCoder.encode(
    solidityInitializationTypes[name],
    Object.values(initData)
  );
}

export async function registerNewType<
  Hub extends CommitmentHub,
  Name extends CommitmentType
>(hub: Hub, contractName: Name) {
  const commit = await deploy(contractName);
  await (
    await hub.registerCommitType(
      commitmentTypeVals[contractName],
      commit.address
    )
  ).wait();
}
