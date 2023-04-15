<script>
  import { onMount } from "svelte";
  import { view } from "./lib/appView";
  import { fade, slide } from "svelte/transition";
  import { quintInOut } from "svelte/easing";

  export let outroDuration = 500;

  let entered = false;
  setTimeout(() => (entered = true), 500);
</script>

{#if entered}
  <div
    class="container"
    style="font-size:1.5em"
    in:fade={{ duration: 500 }}
    out:fade={{ duration: outroDuration }}
  >
    <div out:fade={{ duration: 400 }}>
      <h3>Welcome to the Social Alarm Clock</h3>
    </div>
    <div transition:fade={{ duration: 800, delay: 1200 }}>
      <div style="height: 40px;">
        <button style="margin:1em" on:click={view.exitWelcome}>Enter</button>
        <button style="margin:1em" on:click={view.exitWelcome}>About</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
  }
</style>
