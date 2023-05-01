<script>
  import { account } from "../../lib/chainClient";
  import { otherPlayer } from "../alarmCreation";

  $: error = $otherPlayer === $account?.address;
</script>

<div>Select Partner (Address)</div>
<input id="select-partner" bind:value={$otherPlayer} />
{#if error}
  <div style="color: red"><i>You cannot select yourself as a partner</i></div>
{/if}
