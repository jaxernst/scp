<script lang="ts">
  import { fade, scale, crossfade, slide } from "svelte/transition";

  type T = $$Generic;
  export let input: T;
  export let inputValid: (input: T) => boolean;
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
</script>

<button
  class={" flex flex-col gap-2 justify-start px-1 pb-1 bg-zinc-700 h-[85px] rounded-xl w-min-content relative transition " +
    (active
      ? " transition duration-1000 scale-110 border-zinc-200 border "
      : "")}
  use:activeOnChildFocus
>
  <div class={"text-s text-bold text-zinc-500"}>
    {itemNumber}
    {#if active || input}
      <span transition:fade>{active || input ? filledHeader : ""}</span>
    {/if}
  </div>
  <div class="grid">
    {#if active || input}
      <div class="col-start-1 row-start-1" transition:slide={{ axis: "x" }}>
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
