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

import { ethers, Signer, type BigNumberish, Wallet } from "ethers";
import {
  Address,
  Chain,
  Client,
  WalletClient,
  getContract,
  parseEther,
} from "viem";
import { DeploymentChain, deployments } from "./deployments";
import CommitmentHubAbi from "../abi/CommitmentHub";
import { ScpContext } from ".";

export function getHubAddress(chain: Chain) {
  const chainDeployment = deployments[chain.id as DeploymentChain];
  if (!chainDeployment) {
    throw new Error(`No deployment found for chain ${chain.name}`);
  }
  if (!chainDeployment.CommitmentHub) {
    throw new Error(
      `No CommitmentHub found for chain ${chain.name} in deployments`
    );
  }

  return chainDeployment.CommitmentHub;
}

export function getCommitmentHub(client: WalletClient) {
  if (!client.chain) throw new Error("No chain found on client");

  return getContract({
    walletClient: client,
    address: getHubAddress(client.chain),
    abi: CommitmentHubAbi,
  });
}

export async function registerCommitmentType(
  { wallet, publicClient, hubAddress }: ScpContext,
  type: CommitmentType,
  deployedAt: Address
) {
  return await wallet.writeContract({
    address: hubAddress,
    abi: CommitmentHubAbi,
    functionName: "registerCommitType",
    args: [commitmentTypeVals[type], deployedAt],
  });
}

export async function createCommitment<T extends CommitmentType>(
  { wallet, publicClient, chain }: ScpContext,
  type: T,
  initData: InitializationTypes[T],
  value?: bigint
) {
  if (!wallet.account) throw new Error("No account found on wallet");

  const { request } = await publicClient.simulateContract({
    account: wallet.account?.address,
    address: getHubAddress(chain),
    abi: CommitmentHubAbi,
    functionName: "createCommitment",
    args: [commitmentTypeVals[type], encodeCreationParams(type, initData)],
    value: parseEther(".1"),
  });

  return await wallet.writeContract(request);
}

export function encodeCreationParams<T extends CommitmentType>(
  name: T,
  initData: InitializationTypes[T]
): `0x${string}` {
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
