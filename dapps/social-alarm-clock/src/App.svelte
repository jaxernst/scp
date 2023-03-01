<script lang="ts">
  import { ClockDisplay } from "@scp/dapp-lib";
  import { getAccount } from "@wagmi/core";
  import { ensName, web3Modal } from "./chainClient";
  import { account } from "./chainClient";
  import Web3Status from "./Web3Status.svelte";
  import { gameActive } from "./gameState";
  import AlarmClockFace from "./AlarmClockFace.svelte";
  import { get, writable } from "svelte/store";
  import ToggleLetter from "./ToggleLetter.svelte";
  import type { SvelteComponentDev } from "svelte/internal";

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

  const alarmSetup = {
    days: {
      M: false,
      T: false,
      W: false,
      Th: false,
      F: false,
      Sa: false,
      Su: false,
    },
  };

  const selected = writable(0)
  const itemWheel = {
    numItems: 5,
    _i: 1,
    next: function () {
      selected.update(() => ++this._i % this.numItems);
    },
    prev: function () {
      selected.update(() => --this._i % this.numItems);
    },
  };
</script>

<main>
  <div class="clock-container">
    <div class="header">
      <div style="width:min-content">
        {#if showBack}
          <button on:click={() => (view = initView())} class="back-button"
            >{"<-"}</button
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
        <div class="wide-bar">
          <div on:click={() => itemWheel.prev()}>{"<-"}</div>
          
          {#if $selected === 1}
            <div>
              Select Days
              <div class="days">
                {#each Object.keys(alarmSetup.days) as day}
                  <ToggleLetter
                    value={day}
                    bind:toggled={alarmSetup.days[day]}
                  />
                {/each}
              </div>
            </div>
          {:else if $selected}
            <div >
              <div>Select Time</div>
              <input id="select-time" type="time" />
            </div>
          {:else if $selected}
            <div>
              <div>Timezone Mode</div>
              <select>
                <option>Same Time of Day</option>
                <option>Same Absolute Time</option>
              </select>
            </div>
          {:else if $selected}
            <div>
              <div>Buy In</div>
              <input type="number" />
            </div>
          {/if}
          <div on:click={itemWheel.next}>{"->"}</div>
        </div>
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

  .back-button {
    background: none;
    background-color: rgb(60, 60, 60);
    padding: 0.3em 0.5em;
  }

  .days {
    display: flex;
    gap: 0.5em;
  }
</style>
