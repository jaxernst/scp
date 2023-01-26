import type { BigNumberish } from "ethers";
import { ethers } from "ethers"
import type { CommitmentHub } from "@scp/protocol/typechain-types"
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
) {
 
  const byteData = encodeCreationParams(type, initData)
  return hub.createCommitment(commitmentTypeVals[type], byteData, {
      value: value ? value : 0
  })
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
