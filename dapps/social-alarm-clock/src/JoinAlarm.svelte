<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { shorthandAddress } from "@scp/dapp-lib";
  import { account } from "./lib/chainClient";
  import { commitmentHub } from "./lib/contractInterface";
  import { getAlarmById, getAlarms } from "./lib/getAlarm";
  import { transactions } from "./lib/transactions";
  import { otherPlayer } from "./create-new-alarm/alarmCreation";

  let alarmId = "";
  let error: null | string = null;

  const joinAlarm = async () => {
    if (!$account) return;

    // Check if other player has an alarm with connected account's address
    const targetAlarm = await getAlarmById(alarmId, $commitmentHub);
    if (!targetAlarm) {
      return (error = "No alarm contract found for provided ID");
    }

    // Check if other player's alarm has the connected account's address as a partner
    const player2 = await targetAlarm.player2();
    if (player2 !== $account.address) {
      error = "This address is not apart of this alarm";
      return;
    }

    const value = targetAlarm.betAmount();
    const otherPlayer = await targetAlarm.player1();
    const txResult = await transactions.addTransaction(
      targetAlarm.start({ value })
    );

    if (!txResult.error) {
      toast.push(
        `Successfully joined alarm with ${shorthandAddress(otherPlayer)}!`
      );
    } else {
      toast.push("Alarm creation failed with: " + txResult.error.message);
    }
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
