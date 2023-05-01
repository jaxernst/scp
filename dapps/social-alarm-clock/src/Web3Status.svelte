<script lang="ts">
  import { account, ensName } from "./lib/chainClient";
  import { web3Modal } from "./lib/chainClient";
  import { shorthandAddress } from "@scp/dapp-lib";

  let displayName: string | undefined;
  $: if ($account?.address) {
    displayName = $ensName ? $ensName : shorthandAddress($account.address);
  }

  $: indicatorColor = $account && $account.isConnected ? "green" : "red";
</script>

<button
  class="flex gap-1 bg-neutral-800 rounded-xl py-1 px-2"
  on:click={() => $web3Modal.openModal()}
>
  <div class="displayName">
    {displayName || ""}
  </div>
  <div class="indicator" style="background-color:{indicatorColor}" />
</button>

<style>
  .indicator {
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: var(--indicator-color);
  }

  .displayName {
    font-size: smaller;
    color: rgb(201, 145, 34);
  }
</style>
