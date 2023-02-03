import { writable } from 'svelte/store';
import type { CommitmentType, InitializationTypes } from '@scp/protocol/lib/types';
import type { ContractTransaction } from 'ethers';

// Should correspond to a specific commitment type
// Could use a factory to make a form store for a specific type of commitment
/**
 * So if we were making a 'deadline' from the frontend, it will determine the
 * commitment type based on the options selected. I.e if a deadline is being made 
 * with a penalty module, the CommitmentType would be a TimelockingDeadlineTask
 * 
 * We don't know the type of commitment being made until the submit button is pressed.
 * 
 * What nees to happen when the submit button is pressed?
 * 
 */


export const formData = writable({})
