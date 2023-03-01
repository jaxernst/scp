<script lang="ts">
  export let value: string = ''
  export let toggled = false
</script>

<button style="all:unset" on:click={() => toggled = !toggled}>
  <div class={"letter" + (toggled ? "active" : "")}>
    {value}
  </div>
</button>

<style>
  .letter {
    color: rgb(133, 133, 133);
    font-weight: 400;
    cursor: pointer;
  }

  .letter:hover {
    text-shadow: 1px 1px 2px black;
  }

  .active {
    color: white;
    font-weight: 800;
  }
</style>