<script lang="ts">
  import { otherPlayer } from "./create-new-alarm/alarmCreation";
  import { account } from "./lib/chainClient";
  import { commitmentHub } from "./lib/contractInterface";
  import { getMostRecentAlarm } from "./lib/getAlarm";

  let joinGameAddress = "";
  let error = null;

  const joinAlarm = async (otherPlayer: string) => {
    // Check if other player has and alarm with connected account's address
    const otherPlayerAlarm = await getMostRecentAlarm(
      $commitmentHub,
      joinGameAddress
    );

    if (!otherPlayerAlarm) {
      error = "No alarm found for this address";
      return;
    }

    // Check if other player's alarm has the connected account's address as a partner
    const player2 = await otherPlayerAlarm.player2();
    if (player2 !== $account.address) {
      error = "This address is not apart of this alarm";
      return;
    }

    const value = otherPlayerAlarm.betAmount();
    otherPlayerAlarm.start({ value });
  };
</script>

<div class="wide-bar">
  <label for="address">Enter Partner's Address: </label>
  <input id="address" type="text" bind:value={joinGameAddress} />
  <button
    style="padding: .2em .5em"
    on:click={() => (error = "") || joinAlarm($otherPlayer)}>go</button
  >
  {#if error}
    <div style="color: red">{error}</div>
  {/if}
</div>
