<script>
    import { onMount } from "svelte";
  
    let date = new Date();
    $: time = date.toLocaleTimeString();
  
    onMount(() => {
      const timerId = setInterval(() => {
        date = new Date();
      }, 1000);
  
      return () => {
        clearInterval(timerId);
      };
    });
  </script>
  
  <span>
    {time}
  </span>