<script lang="ts">
  import { ClockDisplay, shorthandAddress } from "@scp/dapp-lib";
  import { CommitStatus } from "@scp/protocol/lib/types";
  import { web3Modal } from "./lib/chainClient";
  import { account } from "./lib/chainClient";
  import {
    commitmentHub,
    getOtherPlayer,
    userAlarm,
  } from "./lib/contractInterface";
  import { View, showBackButton, view } from "./lib/appView";

  import { SvelteToast } from "@zerodevx/svelte-toast";
  import Web3Status from "./Web3Status.svelte";
  import CreateNewAlarm from "./create-new-alarm/CreateNewAlarm.svelte";
  import JoinAlarm from "./JoinAlarm.svelte";
  import ActiveAlarm from "./active-alarm/ActiveAlarm.svelte";
  import Welcome from "./Welcome.svelte";

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
</script>

{#if $view === View.WELCOME}
  <Welcome />
{:else}
  <main>
    <SvelteToast />

    <div class="container">
      <div class="header">
        <div style="width:min-content">
          {#if $showBackButton}
            <button on:click={view.goBack} class="light-button">{"x"}</button>
          {/if}
          {#if $view === View.ALARM_ACTIVE}
            <div class="clock-display" style={"font-size: 1.2em"}>
              <ClockDisplay />
            </div>
          {/if}
        </div>
        <div class="title">The Social Alarm Clock</div>
        <Web3Status />
      </div>

      {#if $view !== View.ALARM_ACTIVE}
        <div style="font-size:4em"><ClockDisplay /></div>
      {/if}

      <div class="lower-area">
        {#if $view === View.CONNECT_WALLET}
          <button
            class="connect-wallet-button"
            on:click={() => $web3Modal.openModal()}
          >
            Connect Wallet
          </button>
        {:else if $view === View.NO_ALARM}
          <button on:click={() => view.changeTo(View.CREATE_ALARM)}
            >Create Alarm</button
          >
          <button on:click={() => view.changeTo(View.JOIN_ALARM)}
            >Join Alarm</button
          >
        {:else if $view === View.CREATE_ALARM}
          <CreateNewAlarm />
        {:else if $view === View.JOIN_ALARM}
          <JoinAlarm />
        {:else if $view === View.WAITING_FOR_OTHER_PLAYER}
          <div style="outline: 1px dashed grey; padding: 1em">
            <div><b>Alarm {alarmId ? "#" + alarmId : ""} Pending</b></div>
            {#await otherPlayer then otherPlayer}
              <i
                >Waiting for {shorthandAddress(otherPlayer)} to start the alarm</i
              >
            {/await}
          </div>
        {:else if $view === View.ALARM_ACTIVE}
          <ActiveAlarm />
        {:else}
          UH OH
        {/if}
      </div>
    </div>
  </main>
{/if}

<style>
  main {
    border: 1px solid white;
    border-radius: 18px;
    background-color: rgb(54, 54, 54);
    box-shadow: 5px 10px #000000;
    width: 620px;
    min-height: 250px;
    margin: auto;
  }

  @media (max-width: 650px) {
    main {
      width: 90vw;
    }
  }

  .container {
    padding: 1em;
    margin-bottom: 1em;
    min-height: 200px;
    display: flex;
    flex-direction: column;
  }

  .lower-area {
    display: flex;
    justify-content: space-evenly;
    place-items: center;
    flex-grow: 1;
  }

  .connect-wallet-button {
    padding: 1em;
    margin: 1em;
  }

  .header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }

  .title {
    font-weight: bold;
    text-align: center;
  }
</style>
