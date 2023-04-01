<script lang="ts">
  import { fetchEnsName } from "@wagmi/core";
  import { shorthandAddress, EthSymbol } from "@scp/dapp-lib";
  import type { EvmAddress } from "../types";

  export let heading: string = "Player Info";
  export let userAddress: EvmAddress;
  export let betStanding: number = 0;
  export let missedAlarms: number = 0;

  const getDisplayName = async (addr: EvmAddress) => {
    try {
      return await fetchEnsName({ address: addr });
    } catch {
      return shorthandAddress(addr);
    }
  };

  $: displayName = getDisplayName(userAddress);
</script>

<div class="container">
  <div>
    {#await displayName then displayName}
      <div class="heading">{heading}</div>
      <div>
        <div class="user-display">{displayName}</div>
      </div>
    {/await}
  </div>

  <div>
    <div class="stat-label">Bet Standing</div>
    <div
      class="stat"
      style={`color:${
        betStanding === 0 ? "" : betStanding > 0 ? "#00FF30" : "red"
      }`}
    >
      {betStanding > 0 ? "+" : ""}{betStanding}
      <EthSymbol />
    </div>
  </div>

  <div>
    <div class="stat-label">Missed Alarms</div>
    <div class="stat">{missedAlarms}</div>
  </div>
</div>

<style>
  .container {
    margin-top: 1em;
    border-radius: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
  }

  .heading {
    text-decoration: underline;
    padding: 1em;
  }

  .user-display {
    background-color: #1a1a1a;
    padding: 0.5em;
    border-radius: 0.5em;
    font-weight: bold;
  }

  .stat-label {
    grid-row: 1;
    font-size: 0.7em;
    margin: 0.5em 0 0.5em 0;
    white-space: nowrap;
  }

  .stat {
    background-color: #1a1a1a;
    border-radius: 0.5em;
    padding: 0 0.5em 0 0.5em;
  }
</style>
