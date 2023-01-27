import {
	commitmentFactories,
	commitmentTypeVals,
	commitmentValToType,
	CommitStatus,
	solidityInitializationTypes,
	type CommitmentContractTypes,
	type CommitmentType,
	type InitializationTypes
} from '@scp/protocol/lib/types';
import type { CommitmentHub } from '@scp/protocol/typechain-types';
import type { CommitmentCreationEvent } from '@scp/protocol/typechain-types/contracts/CommitmentHub.sol/CommitmentHub';
import { ethers, Signer, type BigNumberish } from 'ethers';
import { contracts } from 'svelte-ethers-store';
import { get } from 'svelte/store';


export async function createCommitment<T extends CommitmentType>(
	hub: CommitmentHub,
	type: T,
	initData: InitializationTypes[T],
	value?: BigNumberish
) {
	const byteData = encodeCreationParams(type, initData);
	return hub.createCommitment(commitmentTypeVals[type], byteData, {
		value: value ? value : 0
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

export function getCommitmentHub(): CommitmentHub | undefined {
	const contract = get(contracts)['CommitmentProtocolHub'];
	if (!contract) return;
	return contract as unknown as CommitmentHub;
}

export function getCommitment<T extends keyof CommitmentContractTypes>(
	type: T,
	address: string,
	signer: Signer
): CommitmentContractTypes[T] {
	const factory = commitmentFactories[type];
	return factory.connect(address, signer) as CommitmentContractTypes[T];
}

export interface UserCommitments {
	active: CommitmentContractTypes[CommitmentType][];
	past: CommitmentContractTypes[CommitmentType][];
}

export async function getUserCommitments(
	creationEvents: CommitmentCreationEvent[] | Promise<CommitmentCreationEvent[]>,
	signer: Signer
): Promise<UserCommitments> {
	creationEvents = await creationEvents;
	const out: UserCommitments = { active: [], past: [] };
	const statusQueries: Promise<any>[] = [];
	for (const { args } of creationEvents) {
		const commitment = getCommitment(commitmentValToType[args._type], args.commitmentAddr, signer);

		const status = commitment.status().then((result: CommitStatus) => {
			if (result === CommitStatus.ACTIVE) return out.active.push(commitment);
			return out.past.push(commitment);
		});

		statusQueries.push(status);
	}

	await Promise.allSettled(statusQueries);
	if (out.active.length + out.past.length !== creationEvents.length) {
		throw Error('getUserCommitments: Invariant error');
	}

	return out;
}
