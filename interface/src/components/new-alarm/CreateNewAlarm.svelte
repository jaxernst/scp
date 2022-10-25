<script lang="ts">
	import NumMembers from './options-cards/NumMembers.svelte';
	import PoolPenalty from './options-cards/PoolPenalty.svelte';
	import WakeupTime from './options-cards/WakeupTime.svelte';
	import { cubicInOut } from 'svelte/easing';
	import { swipeColor } from 'src/lib/transitions/swipeColor'
    import { contracts, selectedAccount } from 'svelte-web3'
	import { alarmParams } from './alarmCreationStore';

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

	let trigger = false;
	const triggerEffect = () => {
		trigger = !trigger;
	};

    const submitCreateAlarm = () => {
        console.log($alarmParams.poolPenatlyBps, $alarmParams.wakeupTimeSeconds)
        $contracts.ProtocolHub?.methods?.createAlarmPool(
            $alarmParams.poolPenatlyBps,
            $alarmParams.wakeupTimeSeconds
        )
        .send({ from: $selectedAccount })
        .then((r: any) => console.log(r))
        .catch((err: any) => console.log(err))
	}

	
</script>

<h3 style="position:relative; color:dimgray" transition:swipeColor={{ duration: 850 }}>
	Create a New Alarm Pool /
	<span class="header">
		Select {ops.activeHeader()}
	</span>
</h3>

<div class="container">
    <button
        class="button-left"
        on:click={() => {
            ops.previous();
            flyParams.setFlyFromRight();
            triggerEffect();
        }}
    >
        {'<'}</button
    >
    <div>
        <svelte:component this={ops.active()} {flyParams} />
    </div>
    <button
        class="button-right"
        on:click={() => {
            ops.next();
            flyParams.setFlyFromLeft();
            triggerEffect();
        }}>{'>'}</button
    >
</div>  

<div style="display:flex; justify-content: center; padding:1em;">
	<button class="button-primary" style="width:90%" on:click={submitCreateAlarm}>Create</button>
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
		background-color: rgb(73, 73, 73);
		height: 50px;
		transition: 0.1s;
		color: white;
	}

	.button-left:hover,
	.button-right:hover {
		outline: 1px solid white;
	}
</style>
