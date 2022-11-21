import { Contract, ethers } from "ethers";
import { AbiCoder, keccak256 } from "ethers/lib/utils";
import { deploy } from "../test/helpers/deploy";
import { BaseCommitment__factory, CommitmentHub } from "../typechain-types";
import { BaseCommitment } from "../typechain-types/contracts/Commitment.sol";
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

  const byteData = ethers.utils.defaultAbiCoder.encode(
    SolidityCommitInitTypes[type],
    Object.values(initData)
  );

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

export async function registerNewType(
  hub: CommitmentHub, 
  contractName: string, 
  type: CommitType
) {
  const commit = await deploy(contractName)
  const funcSig = "__init__" + contractName + "(bytes)"
  if (!commit.interface.functions[funcSig]) {
    throw Error("Expected initialization function not found in interface")
  }

  const initSelector = commit.interface.getSighash(
    commit.interface.functions[funcSig]
  )

  await (await hub.registerCommitType(type, initSelector, commit.address)).wait();
}
