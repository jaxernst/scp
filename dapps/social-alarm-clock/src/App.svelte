<script lang="ts">
  import { ClockDisplay } from "@scp/dapp-lib";
  import { web3Modal } from "./lib/chainClient";
  import { account } from "./lib/chainClient";
  import Web3Status from "./Web3Status.svelte";
  import {
    getOtherPlayer,
    userAlarm,
    userHasActiveAlarm,
  } from "./lib/contractInterface";
  import CreateNewAlarm from "./create-new-alarm/CreateNewAlarm.svelte";
  import JoinAlarm from "./JoinAlarm.svelte";
  import ActiveAlarm from "./active-alarm/ActiveAlarm.svelte";
  import { CommitStatus } from "@scp/protocol/lib/types";

  enum View {
    CONNECT_WALLET,
    NO_ACTIVE_GAME,
    WAITING_FOR_OTHER_PLAYER,
    CREATE_ALARM,
    JOIN_ALARM,
    ALARM_ACTIVE,
  }

  $: getHomeView = () =>
    !$account?.isConnected
      ? View.CONNECT_WALLET
      : !$userHasActiveAlarm
      ? View.NO_ACTIVE_GAME
      : View.ALARM_ACTIVE;

  $: view = getHomeView();
  $: console.log("View val:", view);
  $: showBack = [View.CREATE_ALARM, View.JOIN_ALARM].includes(view);

  $: otherPlayer =
    $userAlarm && $account
      ? getOtherPlayer($userAlarm, $account.address)
      : undefined;
  $: $userAlarm?.status().then((status) => {
    if (status === CommitStatus.INACTIVE) {
      view === View.WAITING_FOR_OTHER_PLAYER;
    }
  });
</script>

<main>
  <div class="container">
    <div class="header">
      <div style="width:min-content">
        {#if showBack}
          <button on:click={() => (view = getHomeView())} class="light-button"
            >{"x"}</button
          >
        {/if}
        {#if view === View.ALARM_ACTIVE}
          <div class="clock-display" style={"font-size: 1.2em"}>
            <ClockDisplay />
          </div>
        {/if}
      </div>
      <div class="title">The Social Alarm Clock</div>
      <Web3Status />
    </div>

    <div style="font-size:4em"><ClockDisplay /></div>
    <div class="lower-area">
      {#if view === View.CONNECT_WALLET}
        <button
          class="connect-wallet-button"
          on:click={() => $web3Modal.openModal()}
        >
          Connect Wallet
        </button>
      {:else if view === View.NO_ACTIVE_GAME}
        {#if $userAlarm}
          <div style="outline: 1px dashed grey; padding: 1em">
            <div>Alarm Pending</div>
            {#await otherPlayer then otherPlayer}
              <i>Waiting for {otherPlayer}</i>
            {/await}
          </div>
        {:else}
          <button on:click={() => (view = View.CREATE_ALARM)}
            >Create Alarm</button
          >
          <button on:click={() => (view = View.JOIN_ALARM)}>Join Alarm</button>
        {/if}
      {:else if view === View.CREATE_ALARM}
        <CreateNewAlarm />
      {:else if view === View.JOIN_ALARM}
        <JoinAlarm />
      {:else if view === View.ALARM_ACTIVE}
        <ActiveAlarm />
      {:else}
        UH OH
      {/if}
    </div>
  </div>
</main>

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
    height: 200px;
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
