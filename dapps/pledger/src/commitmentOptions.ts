import type { CommitmentType } from '@scp/protocol/lib/types';
import CreateDeadlineCommitment from './components/new-commitment/form-components/CreateDeadlineCommitment.svelte'

export type CommitmentOption = {
	id: number;
	name: string;
	commitmentType: CommitmentType;
	formComponent: any;
	displayCardContent?: any;
};

export const commitmentOptions: CommitmentOption[] = [
	{
		id: 0,
		name: 'Deadline',
		commitmentType: 'TimelockingDeadlineTask',
		formComponent: CreateDeadlineCommitment
	},
	{
		id: 1,
		name: 'Goal',
		commitmentType: 'BaseCommitment',
		formComponent: CreateDeadlineCommitment
	},
];
