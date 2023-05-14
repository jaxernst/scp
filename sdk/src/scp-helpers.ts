import {
  commitmentFactories,
  commitmentTypeVals,
  commitmentValToType,
  CommitStatus,
  solidityInitializationTypes,
  type CommitmentContractTypes,
  type CommitmentType,
  type InitializationTypes,
} from "@scp/protocol/lib/types";
import type { CommitmentHub } from "@scp/protocol/typechain-types";
import {
  BaseCommitment,
  CommitmentInitializedEvent,
} from "@scp/protocol/typechain-types/contracts/BaseCommitment";
import type { CommitmentCreationEvent } from "@scp/protocol/typechain-types/contracts/CommitmentHub.sol/CommitmentHub";
import { ethers, Signer, type BigNumberish } from "ethers";
import { CommitmentConstants } from "./types";

export async function createCommitment<T extends CommitmentType>(
  hub: CommitmentHub,
  type: T,
  initData: InitializationTypes[T],
  value?: BigNumberish
) {
  const byteData = encodeCreationParams(type, initData);
  return hub.createCommitment(commitmentTypeVals[type], byteData, {
    value: value ? value : 0,
  });
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

export function getCommitment<T extends keyof CommitmentContractTypes>(
  type: T,
  address: string,
  signer: Signer
): CommitmentContractTypes[T] {
  const factory = commitmentFactories[type];
  return factory.connect(address, signer) as CommitmentContractTypes[T];
}

type CommitmentId = number;
export type CommitmentInfo<T extends CommitmentType> = {
  id: number;
  contract: CommitmentContractTypes[T];
  creationBlock: number;
  status: CommitStatus;
};

export async function getUserCommitmentsByType<T extends CommitmentType>(
  hub: CommitmentHub,
  type: T
): Promise<Record<CommitmentId, CommitmentInfo<T>> | undefined> {
  if (!hub.signer) throw new Error("Hub contract must include signer");

  const account = await hub.signer.getAddress();
  const creationEvents = await queryCommitmentCreationEvents(
    hub,
    account,
    type
  );

  if (!creationEvents) return;

  const out: Record<CommitmentId, CommitmentInfo<T>> = {};
  for (const { args, blockNumber } of creationEvents) {
    const contract = getCommitment(
      type,
      args.commitmentAddr,
      hub.signer
    ) as CommitmentContractTypes[T];

    const id = args.id.toNumber();
    out[id] = {
      id,
      contract,
      creationBlock: blockNumber,
      status: await contract.status(),
    };
  }

  return out;
}

export async function queryCommitmentCreationEvents(
  hub: CommitmentHub,
  address: string,
  commitmentType?: CommitmentType
) {
  return await hub.queryFilter(
    hub.filters.CommitmentCreation(
      address,
      commitmentType ? commitmentTypeVals[commitmentType] : undefined
    )
  );
}

export async function queryUserJoinedCommitmentEvents(
  hub: CommitmentHub,
  address: string,
  commitmentType: CommitmentType
) {
  return await hub.queryFilter(
    hub.filters.UserJoined(commitmentTypeVals[commitmentType], address)
  );
}
