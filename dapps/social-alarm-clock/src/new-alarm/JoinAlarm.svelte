<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { shorthandAddress } from "@scp/dapp-lib";
  import { account } from "../lib/chainClient";
  import { commitmentHub } from "../lib/contractInterface";
  import { getAlarmById, getAlarms } from "../lib/alarmHelpers";
  import { transactions } from "../lib/transactions";

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

<div>
  <h3 class="py-2">Join an Alarm</h3>
  <div class=" flex h-[30px] gap-2 rounded-xl px-3">
    <input
      type="text"
      class=" h-full flex-grow rounded-xl bg-zinc-800 px-2 text-zinc-300 placeholder-zinc-500"
      placeholder="Enter alarm id to join"
      bind:value={alarmId}
    />
    <button
      class="text-bold text-bold rounded-xl bg-zinc-800 px-4 text-cyan-400"
      on:click={() => (error = "") || joinAlarm()}>JOIN</button
    >
  </div>
  {#if error}
    <div class="pl-3 text-red-600">{error}</div>
  {/if}
</div>
