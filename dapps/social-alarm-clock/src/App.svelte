<script lang="ts">
  import { ClockDisplay } from "@scp/dapp-lib";
  import { getAccount } from "@wagmi/core";
  import { ensName, web3Modal } from "./chainClient";
  import { account } from "./chainClient";
  import Web3Status from "./Web3Status.svelte";

  let accountHasAlarm = false
</script>

<main>
  <div class="clock-container">
    <div class="header">
      <div class="title">The Social Alarm Clock</div>
      <Web3Status/>
    </div>
    <div>
      <ClockDisplay />
    </div>
    <div class="game-area">
      {#if $account}
        {#if !accountHasAlarm}
            <button>Create Alarm</button>
            <button>Join Alarm</button>
        {/if}

      {:else}
        <button class="connect-wallet-button" on:click={$web3Modal.openModal()}>
          Connect Wallet
        </button>
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
  }

  .title {
    grid-column: 2/3;
  }


</style>
