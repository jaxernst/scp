<script lang="ts">
	import NumMembers from './options-cards/NumMembers.svelte';
	import PoolPenalty from './options-cards/PoolPenalty.svelte';
	import WakeupTime from './options-cards/WakeupTime.svelte';
	import PendingTransaction from './PendingTransaction.svelte';

	import type { ContractTransaction } from 'ethers';
	import { cubicInOut } from 'svelte/easing';
	import { alarmParams } from './alarmCreationStore';
	import { modal } from '$lib/stores/stores';
	import { bind } from 'svelte-simple-modal';
	import { onDestroy } from 'svelte';
    import { getComittmentProtocolHub } from '$lib/getContract';

	// Create a promise that resolves once the component is
	// destroyed (All transitions have completed)
	const compDestroyed: Promise<void> = new Promise((r) => {
		onDestroy(() => {
			r();
		});
	});

	export const flyParams = {
		in: { x: 500, duration: 400, easing: cubicInOut },
		out: { x: 500, duration: 400, easing: cubicInOut },
		setFlyFromRight: function () {
			this.in.x = -Math.abs(this.in.x);
			this.out.x = Math.abs(this.out.x);
		},
		setFlyFromLeft: function () {
			this.in.x = Math.abs(this.in.x);
			this.out.x = -Math.abs(this.out.x);
		}
	};

	const ops = {
		comps: [NumMembers, PoolPenalty, WakeupTime],
		headers: ['Number of Pool Members', 'Missed wakeup penalty', "Pool's Wakeup Time"],
		i: 0,
		active: () => ops.comps[Math.abs(ops.i) % ops.comps.length],
		activeHeader: () => ops.headers[Math.abs(ops.i) % ops.comps.length],
		next: () => ops.i++,
		previous: () => ops.i--
	};

    const onArrowClick = (direction: "right" | "left") => {
        switch (direction) {
            case "right":
                ops.next();
                flyParams.setFlyFromLeft();
                break
            case "left":
                ops.previous();
                flyParams.setFlyFromRight();
                break
        }    

        triggerEffect();
    }

	let trigger = false;
	const triggerEffect = () => {
		trigger = !trigger;
	};

	const submitCreateAlarm = async () => {
		let tx: ContractTransaction;
		try {
			const hub = getComittmentProtocolHub()!
            tx = await hub.createAlarmPool(
				$alarmParams.poolPenatlyBps,
				$alarmParams.wakeupTimeSeconds
			);
		} catch (err: unknown) {
			console.log(err);
			alarmParams.resetDefault();
			// modal.set(ErrorComponent)
			return;
		}
        
		modal.set(bind(PendingTransaction, { complete: false, waitFor: compDestroyed }));
		await new Promise((r) => setTimeout(r, 3000));
		await tx.wait();
		modal.set(bind(PendingTransaction, { complete: true }));
	};
</script>

<h3 style="position:relative; color:dimgray">
	Create a New Alarm Pool /
	<span class="header">
		Select {ops.activeHeader()}
	</span>
</h3>

<div class="container">
	<button class="button-left" on:click={()=> onArrowClick("left")}>
        {'<'}
    </button>

	<div>
		<svelte:component this={ops.active()} {flyParams} />
	</div>

	<button
		class="button-right"
		on:click={() => onArrowClick("right")}>{'>'}</button
	>
</div>

<div style="display:flex; justify-content: center; padding:1em;">
	<button class="button-primary" style="width:30%" on:click={submitCreateAlarm}>Create</button>
</div>

<style>
	h3 {
		text-align: left;
		margin-top: 0;
		margin-left: 5px;
	}

	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 150px;
		position: relative;
	}

	button {
		margin: 1em;
	}

	.header {
		color: var(--theme-color1);
		position: absolute;
		padding-left: 5px;
	}

	.button-left,
	.button-right {
		border: none;
		background-color: rgb(36, 36, 36);
		height: 50px;
		transition: 0.1s;
		color: white;
	}

	.button-left:hover,
	.button-right:hover {
		outline: 1px solid white;
	}
</style>
