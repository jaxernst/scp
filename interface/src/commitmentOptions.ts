import NewBaseCommitment from "./components/new-commitment/form-components/NewBaseCommitment.svelte";
import NewTimelockingDeadlineTask from "./components/new-commitment/form-components/NewTimelockingDeadlineTask.svelte";
import NewTodo from "./components/new-commitment/form-components/NewTodo.svelte";
import ToDoCard from "./components/commitments-display/ToDoCard.svelte"
import type { CommitmentType } from "@scp/protocol/lib/types"

export type CommitmentOption = {
    id: number, 
    name: string, 
    commitmentType: CommitmentType,
    formComponent: any,
	displayCardContent?: any
}

export const commitmentOptions: CommitmentOption[] = [
	{
		id: 0,
		name: 'Todo',
		commitmentType: 'BaseCommitment',
    	formComponent: NewTodo,
		displayCardContent: ToDoCard
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
