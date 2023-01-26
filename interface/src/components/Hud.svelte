<script>

</script>

<div class=grid>
  <div class="label grid-item">Due Next</div>
  <div class="label grid-item">Active</div>
  <div class="label grid-item">Missed</div>
  <div class="label grid-item">Total</div>
  <div class="label grid-item">Value Pledged</div>
  <div class=values>
    <div class=grid-item>2 Hours</div>
    <div class=grid-item>1</div>
    <div class=grid-item>0</div>
    <div class=grid-item>13</div>
    <div class=grid-item><span style="font-family:Arial">Ξ</span>0.013</div>
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-auto-rows: min-content;
    width: 100%;
  }

  .grid-item {
    padding: 0 5px 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  } 

  .label {
    font-size: x-small;
    margin-bottom: 5px;
  }
  
  .values {
    display: contents;
    font-family: 'Orbitron';
  }
  
  .values > .grid-item {
    background-color: var(--theme-container2);
    padding: .8em .4em .8em .4em;
    height: 35px;
    font-size: max(1.4vw, 16px);
    white-space: nowrap;
  }

  .values > :first-child {
    border-top-left-radius: var(--border-radius3);
    border-bottom-left-radius: var(--border-radius3);
  }

  .values > :last-child {
    border-top-right-radius: var(--border-radius3);
    border-bottom-right-radius: var(--border-radius3);
  }
</style>

