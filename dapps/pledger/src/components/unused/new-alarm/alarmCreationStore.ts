import { writable } from 'svelte/store';

const defaultWakeupTimeSeconds = 60 * 60 * 8;
const defaultPoolPenalty = 5000;

interface NewAlarmParams {
	wakeupTimeSeconds: number;
	poolPenatlyBps: number;
}

function createAlarmStore() {
	const initState: NewAlarmParams = {
		wakeupTimeSeconds: defaultWakeupTimeSeconds,
		poolPenatlyBps: defaultPoolPenalty
	};

	const alarm = writable<NewAlarmParams>(initState);

	return {
		subscribe: alarm.subscribe,
		setWakeupTime: (hr: number, min: number, second: number) => {
			alarm.update((alarm: NewAlarmParams) => {
				const wakeupTimeSeconds = hr * 60 * 60 + min * 60 + second;
				return { ...alarm, wakeupTimeSeconds };
			});
		},
		setPercentFee: (percFee: number) => {
			alarm.update((alarm: NewAlarmParams) => {
				return { ...alarm, poolPenatlyBps: percFee * 100 };
			});
		},
		resetDefault: () => alarm.set(initState)
	};
}

export const alarmParams = createAlarmStore();
