<script lang="ts">
  import { ClockDisplay } from "@scp/dapp-lib";
  import { web3Modal } from "./chainClient";
  import { account } from "./chainClient";
  import Web3Status from "./Web3Status.svelte";
  import { createGameOptions, gameActive } from "./gameState";
  import CreateNewAlarm from "./create-new-alarm/CreateNewAlarm.svelte";

  let joinGameAddress = "";
  let accountHasAlarm = false;

  enum View {
    CONNECT_WALLET,
    NO_ACTIVE_GAME,
    CREATE_ALARM,
    JOIN_ALARM,
    ALARM_ACTIVE,
  }

  $: initView = () =>
    !$account?.isConnected
      ? View.CONNECT_WALLET
      : !$gameActive
      ? View.NO_ACTIVE_GAME
      : View.ALARM_ACTIVE;

  $: view = initView();

  $: showBack = [View.CREATE_ALARM, View.JOIN_ALARM].includes(view);

  $: selected = $createGameOptions.selected;
  $: console.log(selected);
</script>

<main>
  <div class="clock-container">
    <div class="header">
      <div style="width:min-content">
        {#if showBack}
          <button on:click={() => (view = initView())} class="light-button"
            >{"x"}</button
          >
        {/if}
      </div>
      <div class="title">The Social Alarm Clock</div>
      <Web3Status />
    </div>
    <div>
      <ClockDisplay />
    </div>
    <div class="game-area">
      {#if view === View.CONNECT_WALLET}
        <button class="connect-wallet-button" on:click={$web3Modal.openModal()}>
          Connect Wallet
        </button>
      {:else if view === View.NO_ACTIVE_GAME}
        <button on:click={() => (view = View.CREATE_ALARM)}>Create Alarm</button
        >
        <button on:click={() => (view = View.JOIN_ALARM)}>Join Alarm</button>
      {:else if view === View.CREATE_ALARM}
        <CreateNewAlarm />
      {:else if view === View.JOIN_ALARM}
        <div class="wide-bar">
          <label for="address">Enter Partner's Address: </label>
          <input id="address" type="text" bind:value={joinGameAddress} />
          <button style="padding: .2em .5em">go</button>
        </div>
      {:else if view === View.ALARM_ACTIVE}
        Alarm active
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
    background-color: rgb(80, 80, 80);
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

  .clock-container {
    padding: 1em;
    display: flex;
    flex-direction: column;
  }

  .game-area {
    display: flex;
    justify-content: space-evenly;
    place-items: center;
    margin-bottom: 1em;
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

  .wide-bar {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1em;
  }
</style>
