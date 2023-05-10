<script lang="ts">
  import { fetchEnsName } from "@wagmi/core";
  import { shorthandAddress, EthSymbol } from "@scp/dapp-lib";
  import type { EvmAddress } from "../types";
  import { getBetStanding } from "../lib/alarmHelpers";
  import type { BigNumber } from "ethers";
  import { userAlarm } from "../lib/contractInterface";
  import { formatEther } from "ethers/lib/utils.js";

  export let playerAddress: EvmAddress;
  export let heading: string = "Player Info";
  $: missedAlarms = $userAlarm!.missedDeadlines(playerAddress);
  $: betStanding = getBetStanding(playerAddress, $userAlarm!).then((res) =>
    Number(formatEther(res))
  );

  const getDisplayName = async (addr: EvmAddress) => {
    try {
      return await fetchEnsName({ address: addr });
    } catch {
      return shorthandAddress(addr);
    }
  };

  $: displayName = getDisplayName(playerAddress);
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
    {#await betStanding}
      Loading...
    {:then betStanding}
      <div
        class="stat"
        style={`color:${
          betStanding === 0 ? "" : betStanding > 0 ? "#00FF30" : "red"
        }`}
      >
        {betStanding > 0 ? "+" : ""}{betStanding}
        <EthSymbol />
      </div>
    {/await}
  </div>

  <div>
    <div class="stat-label">Missed Alarms</div>
    {#await missedAlarms}
      Loading...
    {:then missedAlarms}
      <div class="stat">{missedAlarms}</div>
    {/await}
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
