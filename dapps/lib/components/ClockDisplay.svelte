<script lang="ts">
  import { onMount } from "svelte";
  export let overrideTime: string | null = null;
  export let overrideColor: string | null = "";

  let date = new Date();

  $: time = overrideTime
    ? overrideTime
    : date.toLocaleTimeString()[1] === ":"
    ? "0" + date.toLocaleTimeString()
    : date.toLocaleTimeString();

  onMount(() => {
    const timerId = setInterval(() => {
      date = new Date();
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  });

  const backgroundText = () => {
    let background = "";
    for (let i = 0; i < time.length; i++) {
      if (["A", "M", "P"].includes(time[i])) {
        background += "8";
      } else if (time[i] === " " || isNaN(Number(time[i]))) {
        background += time[i];
      } else {
        background += "8";
      }
    }
    return background;
  };
</script>

<div
  class="clock-text-container"
  style={overrideColor ? `color: ${overrideColor}` : ""}
>
  <div class="clock-text">
    {time}
  </div>
  <div class="clock-text background">
    {backgroundText()}
  </div>
</div>

<style>
  /* latin */
  @font-face {
    font-family: "digital-clock";
    src: url("fonts/digital-7.ttf");
  }

  .clock-text-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    margin: 0;
    padding: 0;
  }

  .clock-text {
    align-items: center;
    font-size: 1em;
    font-family: "digital-clock", sans-serif;
    font-weight: 500;

    margin: 0;
    padding: 0;
  }

  .background {
    opacity: 0.05;
    position: absolute;
    text-shadow: 5px 3px #000000;
  }
</style>
