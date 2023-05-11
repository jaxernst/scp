<script lang="ts">
  import { fade, scale, crossfade, slide } from "svelte/transition";

  type T = $$Generic;
  export let inputEmpty: boolean;
  export let inputValid: boolean;
  export let emptyHeader: string;
  export let filledHeader: string;
  export let itemNumber: number;

  let active = false;

  function activeOnChildFocus(node: HTMLElement) {
    const handleFocusIn = () =>
      (active = node.contains(document.activeElement));

    document.addEventListener("focusin", handleFocusIn);
    return {
      destroy: () => {
        document.removeEventListener("focusin", handleFocusIn);
      },
    };
  }

  $: buttonClasses = () => {
    const classes = [];
    if (active) classes.push(" duration-500 scale-105 ");
    if (active && inputEmpty) classes.push(" border border-zinc-200 ");
    if (inputEmpty) return;
    if (inputValid) classes.push(" border border-cyan-400 ");
    if (!inputValid) classes.push(" border border-red-500 ");
    return classes.join(" ");
  };
</script>

<button
  class={"  relative flex h-[85px] flex-col justify-start gap-2 rounded-xl bg-zinc-800 px-1 pb-1 transition " +
    buttonClasses()}
  use:activeOnChildFocus
>
  <div class={"text-s text-bold text-zinc-500"}>
    {itemNumber}
    {#if active || !inputEmpty}
      <span transition:fade>{active || !inputEmpty ? filledHeader : ""}</span>
    {/if}
  </div>
  <div class="grid">
    {#if active || !inputEmpty}
      <div
        class="col-start-1 row-start-1 px-1"
        transition:slide={{ axis: "x" }}
      >
        <slot />
      </div>
    {:else}
      <div
        out:fade={{ duration: 200 }}
        in:fade={{ delay: 200 }}
        class="col-start-1 row-start-1 whitespace-nowrap"
      >
        {emptyHeader}
      </div>
    {/if}
  </div>
</button>
