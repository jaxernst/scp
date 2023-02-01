import type { CommitmentType } from '@scp/protocol/lib/types';

export const CommitmentProtocolHubAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const supportedCommitmentTypes: CommitmentType[] = [
	'BaseCommitment',
	'TimelockingDeadlineTask'
];
