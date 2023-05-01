<script>
  import { EthSymbol } from "@scp/dapp-lib";
  import { buyIn } from "../alarmCreation";
</script>

<div>Select Buy In</div>
<div>
  <input type="number" bind:value={$buyIn} min="0" step="0.001" />
  <b><EthSymbol /></b>
</div>

<style>
</style>
