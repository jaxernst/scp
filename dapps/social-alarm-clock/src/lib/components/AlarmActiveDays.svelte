<script>
  export let daysActive = [];
  export let activeColor = "#00FF30";

  const days = [
    { name: "Su", id: 1, class: "day" },
    { name: "M", id: 2, class: "day" },
    { name: "Tu", id: 3, class: "day" },
    { name: "W", id: 4, class: "day" },
    { name: "Th", id: 5, class: "day" },
    { name: "F", id: 6, class: "day" },
    { name: "Sa", id: 7, class: "day" },
  ];

  let today = new Date().getDay() + 1;

  $: {
    for (let day of days) {
      if (daysActive.includes(day.id)) {
        day.class += " active";
      }
      if (day.id === today) {
        day.class += " today";
      }
    }
  }
</script>

<div class="days-row" style={`--active-color: ${activeColor}`}>
  {#each days as day}
    <div class={day.class}>{day.name}</div>
  {/each}
</div>

<style>
  .days-row {
    display: inline-flex;
    flex-wrap: wrap;
    flex-direction: row;
    font-size: 1em;
    justify-content: center;
    padding-bottom: 0.5em;
  }

  .day {
    padding: 0.5em;
    color: white;
    opacity: 0.3;
  }

  .today {
    border-bottom: 0.1em solid white;
    opacity: 1;
  }

  .active {
    opacity: 1;
    color: var(--active-color);
  }
</style>
