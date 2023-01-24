import NewBaseCommitment from "./form-components/NewBaseCommitment.svelte";
import NewTimelockingDeadlineTask from "./form-components/NewTimelockingDeadlineTask.svelte";
import NewTodo from "./form-components/NewTodo.svelte";
import type { CommitmentType } from "@scp/protocol/lib/types"

export type CommitmentOption = {
    id: number, 
    name: string, 
    commitmentType: CommitmentType,
    formComponent: any
}

export const commitmentOptions: CommitmentOption[] = [
	{
		id: 0,
		name: 'Todo',
		commitmentType: 'BaseCommitment',
        formComponent: NewTodo
	},
	{
		id: 1,
		name: 'Timelock  Deadline',
		commitmentType: 'TimelockingDeadlineTask',
        formComponent: NewTimelockingDeadlineTask
	},
	{
		id: 2,
		name: 'Goal',
		commitmentType: 'BaseCommitment',
        formComponent: NewBaseCommitment
	},
	{
		id: 3,
		name: 'Alarm',
		commitmentType: 'BaseCommitment',
        formComponent: NewBaseCommitment
	}
];
