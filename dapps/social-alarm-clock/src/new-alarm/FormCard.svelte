<script lang="ts">
  import type { Writable } from "svelte/store";

  export let emptyHeader: string;
  export let filledHeader: string;
  export let inputValid: boolean;

  let showInput = false;
</script>

<button
  class={" flex flex-col justify-start px-1 pb-1 bg-zinc-700 h-[85px] rounded-xl w-min-content relative transition focus:scale-110 focus:border-zinc-200 focus:border "}
  class:inputValid={"border-green-500"}
  on:focus={() => (showInput = true)}
>
  <div class={"text-s text-bold text-zinc-500"}>
    1 {showInput ? filledHeader : ""}
  </div>
  {#if showInput}
    <slot />
  {:else}
    <div class="">{emptyHeader}</div>
  {/if}
</button>
