import { Contract, ethers } from "ethers";
import { deploy } from "../test/helpers/deploy";
import { CommitmentHub } from "../typechain-types";
import {
  CommitFactoryMapping,
  CommitContractNames,
  CommitContractTypes,
  CommitInitDataTypes,
  CommitTypeVals,
  SolidityCommitInitTypes,
  CommitType,
  InitializationTypes,
} from "./types";


export async function createCommitment<
  Hub extends CommitmentHub,
  T extends CommitTypeVals
>(
  hub: Hub,
  type: T,
  initData: InitializationTypes[T]
): Promise<CommitContractTypes[T]> {

  if (
    (await hub.commitTemplateRegistry(type)) === ethers.constants.AddressZero
  ) {
    await registerNewType(hub, CommitContractNames[type], type)
  }

  const byteData = encodeCreationParams(type, initData)
  const rc = await (
    await hub.createCommitment(type, byteData)
  ).wait();
  
  if (!rc.events) throw Error("No events found in tx");

  let commitAddr: string;
  for (const event of rc.events) {
    if (event.event && event.event == "CommitmentCreation") {
      commitAddr = event.args!.commitmentAddr;
    }
  }

  return (CommitFactoryMapping[type] as any).connect(commitAddr!, hub.signer);
}

export function encodeCreationParams<T extends CommitTypeVals>(
  type: T, 
  initData: InitializationTypes[T]
): string {
  return ethers.utils.defaultAbiCoder.encode(
    SolidityCommitInitTypes[type],
    Object.values(initData)
  );
}

export async function registerNewType(
  hub: CommitmentHub, 
  contractName: string, 
  type: CommitType
) {
  const commit = await deploy(contractName)
  await (await hub.registerCommitType(type, commit.address)).wait();
}
