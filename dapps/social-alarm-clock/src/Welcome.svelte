<script>
  import { onMount } from "svelte";
  import { view } from "./lib/appView";
  import { fade, slide } from "svelte/transition";
  import { quintInOut } from "svelte/easing";

  let entered = false;
  setTimeout(() => (entered = true), 500);
</script>

{#if entered}
  <div
    class="container"
    style="font-size:1.5em"
    in:slide={{ duration: 500, easing: quintInOut }}
  >
    <div>
      <h3>Welcome to the Social Alarm Clock</h3>
      <i transition:fade={{ duration: 800, delay: 1200 }}>Wake up earlier.</i>
    </div>
    <div style="height: 40px;">
      <button
        style="margin:1em"
        transition:fade={{ duration: 1200, delay: 2000 }}
        on:click={view.exitWelcome}>Enter</button
      >
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
