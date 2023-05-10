<script lang="ts">
  import { account, ensName } from "./lib/chainClient";
  import { web3Modal } from "./lib/chainClient";
  import { shorthandAddress } from "@scp/dapp-lib";

  import AlarmClockSymbol from "./assets/alarm-clock-symbol.svelte";

  let displayName: string | undefined;
  $: if ($account?.address) {
    displayName = $ensName ? $ensName : shorthandAddress($account.address);
  }

  $: indicatorColor = $account && $account.isConnected ? "green" : "red";
</script>

<button
  class="flex gap-4 bg-neutral-800 items-center rounded-xl py-1 px-4"
  on:click={() => $web3Modal.openModal()}
>
  <div class="flex items-center gap-1">
    <div class="h-[18px] w-[18px] stroke-cyan-500"><AlarmClockSymbol /></div>
    <div>0</div>
  </div>

  <div class="flex gap-1 h-full items-center">
    <div class="indicator" style="background-color:{indicatorColor}" />
    <div class="displayName">
      {displayName || ""}
    </div>
  </div>
</button>

<style>
  .indicator {
    height: 8px;
    width: 8px;
    transform: translate(0, -6px);
    border-radius: 100%;
    background-color: var(--indicator-color);
  }

  .displayName {
    font-size: smaller;
    color: rgb(201, 145, 34);
  }
</style>
