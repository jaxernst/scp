import type { BigNumberish } from "ethers";
import { ethers } from "ethers"
import type { CommitmentHub } from "@scp/protocol/typechain-types";
import type { 
  CommitmentType, 
  CommitmentContractTypes, 
  InitializationTypes, 
} from "@scp/protocol/lib/types";
import { 
    commitmentTypeVals,  
    commitmentFactories,
    solidityInitializationTypes
} from "@scp/protocol/lib/types";
import { ZERO_ADDRESS } from "./constants";


export async function createCommitment<
  T extends CommitmentType
>(
  hub: CommitmentHub,
  type: T,
  initData: InitializationTypes[T],
  value?: BigNumberish
): Promise<CommitmentContractTypes[T]> {
 

  const byteData = encodeCreationParams(type, initData)
  const rc = await (
    await hub.createCommitment(commitmentTypeVals[type], byteData, {
      value: value ? value : 0
    })
  ).wait();
  
  if (!rc.events) throw Error("No events found in tx");

  let commitAddr: string;
  for (const event of rc.events) {
    if (event.event && event.event == "CommitmentCreation") {
      commitAddr = event.args!.commitmentAddr;
    }
  }

  return (commitmentFactories[type] as any).connect(commitAddr!, hub.signer);
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
