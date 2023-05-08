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
import { Client } from "viem";

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

export function getCommitmentByType<T extends keyof CommitmentContractTypes>(
  type: T,
  address: string,
  signer: Signer
): CommitmentContractTypes[T] {
  const factory = commitmentFactories[type];
  return factory.connect(address, signer) as CommitmentContractTypes[T];
}

export interface UserCommitment {
  contract: CommitmentContractTypes[CommitmentType];
  creationBlock: number;
  description: string;
  status: CommitStatus;
}

export async function getUserCommitments(
  hub?: CommitmentHub,
  user?: Signer
): Promise<Record<number, UserCommitment> | undefined> {
  if (!hub || !user) return;

  const creationEvents = await queryCommitmentCreationEvents(
    hub,
    await user.getAddress()
  );

  if (!creationEvents) return;

  const out: Record<number, UserCommitment> = {};
  const queryResults = [];
  for (const { args, blockNumber } of creationEvents) {
    const contract = getCommitment(
      commitmentValToType[args._type],
      args.commitmentAddr,
      user
    );

    out[args.id.toNumber()] = {
      contract,
      creationBlock: blockNumber,
      description: await getDescription(contract),
      status: await contract.status(),
    };
  }

  return out;
}

export async function getDescription(commit: BaseCommitment) {
  const initEvent = await commit.queryFilter(
    commit.filters.CommitmentInitialized()
  );
  return initEvent[0].args.description;
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
