<script lang="ts">
  import { ClockDisplay, shorthandAddress } from "@scp/dapp-lib";

  import { web3Modal } from "./lib/chainClient";
  import { account } from "./lib/chainClient";
  import { commitmentHub, userAlarm } from "./lib/contractInterface";
  import { View, showBackButton, view } from "./lib/appView";

  import { SvelteToast } from "@zerodevx/svelte-toast";
  import Web3Status from "./Web3Status.svelte";
  import CreateNewAlarm from "./create-new-alarm/CreateNewAlarm.svelte";
  import JoinAlarm from "./JoinAlarm.svelte";
  import ActiveAlarm from "./active-alarm/ActiveAlarm.svelte";
  import Welcome from "./Welcome.svelte";
  import { fade } from "svelte/transition";
  import { getOtherPlayer } from "./lib/alarmHelpers";
  import PendingAlarms from "./PendingAlarms.svelte";

  $: otherPlayer =
    $userAlarm && $account?.address
      ? getOtherPlayer($userAlarm, $account.address)
      : undefined;

  let alarmId: string | null = null;
  $: if ($commitmentHub && $userAlarm && !alarmId) {
    $commitmentHub.commitmentIds($userAlarm.address).then((id) => {
      if (id) alarmId = id.toString();
    });
  }

  $: mainBackgroundColor =
    $view !== View.ALARM_ACTIVE ? "rgb(54, 54, 54, .2);" : "var(--bg-color1)";
</script>

<SvelteToast />

<div class="top-bar">
  <div class="title">The Social Alarm Clock</div>
  <div class="clock-container">
    <ClockDisplay />
  </div>
  <div class="top-bar-right">
    {#if $view === View.CONNECT_WALLET}
      <button
        class="wallet-button connected"
        on:click={() => $web3Modal.openModal()}
      >
        Connect Wallet
      </button>
    {:else}
      <button class="wallet-button not-connected">
        <Web3Status />
      </button>
    {/if}
  </div>
</div>

{#if $view === View.WELCOME}
  <Welcome outroDuration={500} />
{:else}
  <main
    in:fade={{ duration: 500, delay: 500 }}
    style={`--bg-color-main: ${mainBackgroundColor};`}
  >
    {#if $showBackButton}
      <div class="main-body-header">
        <button on:click={view.goBack} class="x-button">{"X"}</button>
      </div>
    {/if}

    <div class="main-body-content">
      {#if $view === View.CONNECT_WALLET}
        <div class="welcome">
          <h2>Welcome to the Social Alarm Clock.</h2>
          <p>Connect your wallet to start waking up earlier.</p>
        </div>
      {:else if $view === View.NO_ALARM}
        <div class="new-alarm-button-container">
          <button
            class="new-alarm-button"
            on:click={() => view.changeTo(View.CREATE_ALARM)}
            >Create Alarm</button
          >
        </div>
        <div style="display:flex; align-items: center;">
          <div class="divider-line" />
        </div>
        <div class="new-alarm-button-container">
          <button
            class="new-alarm-button"
            on:click={() => view.changeTo(View.JOIN_ALARM)}>Join Alarm</button
          >
        </div>
      {:else if $view === View.CREATE_ALARM}
        <CreateNewAlarm />
      {:else if $view === View.JOIN_ALARM}
        <JoinAlarm />
      {:else if $view === View.WAITING_FOR_OTHER_PLAYER}
        {#await alarmId then alarmId}
          {#await otherPlayer then otherPlayer}
            <PendingAlarms items={[{ otherPlayer, id: alarmId }]} />
          {/await}
        {/await}
      {:else if $view === View.ALARM_ACTIVE}
        <ActiveAlarm />
      {/if}
    </div>
  </main>
{/if}

<style>
  main {
    border: 1px solid rgb(140, 140, 140);
    border-radius: 18px;
    background-color: var(--bg-color-main);
    box-shadow: 5px 10px #000000;
    width: 620px;
    min-height: 250px;
    margin: auto;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 650px) {
    main {
      width: 90vw;
    }
  }

  .main-body-content {
    flex-grow: 1;
    display: flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
  }

  .top-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 1em;
  }

  .welcome {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    place-content: center;
  }

  .title {
    font-weight: bold;
    text-align: left;
    font-size: 1.2em;
  }

  .top-bar-right {
    display: flex;
    justify-content: flex-end;
  }

  .main-body-header {
    display: flex;
    padding: 0.5em;
  }

  .wallet-button {
    padding: 0.8em;
    margin: 1em;
    border-radius: 18px;
  }

  .wallet-button.connected {
    background-color: rgb(61, 101, 114);
    border: 1px solid rgb(255, 255, 255);
  }

  .wallet-button.not-connected {
    border: 1px solid rgb(75, 75, 75);
  }

  .clock-container {
    font-size: 2em;
    padding: 0.4em 0.8em 0.3em 0.8em;
    background: rgba(15, 15, 15, 0.886);
    border-radius: 18px;
  }

  .new-alarm-button-container {
    flex-grow: 1;
  }

  .new-alarm-button {
    background: none;
    border-radius: 18px;
    height: 100%;
    width: 100%;
  }

  .new-alarm-button:hover {
    background-color: var(--button-highlight1);
    transition: background-color 0.3s ease-in-out;
  }

  .x-button {
    background-color: var(--bg-color2);
    border-radius: 18px;
    font-size: 0.5em;
  }

  .divider-line {
    width: 1px;
    height: 60%;
    background: rgb(109, 109, 109);
  }
</style>
