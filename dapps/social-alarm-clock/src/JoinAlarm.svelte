<script lang="ts">
  import { account } from "./lib/chainClient";
  import { commitmentHub } from "./lib/contractInterface";
  import { getAlarmById, getAlarms } from "./lib/getAlarm";

  let alarmId = "";
  let error: null | string = null;

  const joinAlarm = async () => {
    if (!$account) return;

    // Check if other player has an alarm with connected account's address
    const otherPlayerAlarm = await getAlarmById(alarmId, $commitmentHub);
    if (!otherPlayerAlarm) {
      return (error = "No alarm contract found for provided ID");
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
  <label for="address">Enter Partner's Alarm ID: </label>
  <input id="address" type="text" bind:value={alarmId} />
  <button
    style="padding: .2em .5em"
    on:click={() => (error = "") || joinAlarm()}>go</button
  >
  {#if error}
    <div style="color: red">{error}</div>
  {/if}
</div>
