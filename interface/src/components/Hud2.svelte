<script>
	import ConnectionStatus from "./ConnectionStatus.svelte";


</script>

<div class=grid>
  <div class="label grid-item">Due Next</div>
  <div class="label grid-item">Active</div>
  <div class="label grid-item">Missed</div>
  <div class="label grid-item">Total</div>
  <div class="label grid-item">Value Pledged</div>
  <div class="grid-item"/>
  <div class=values>
    <div class=grid-item>2 Hours</div>
    <div class=grid-item>1</div>
    <div class=grid-item>0</div>
    <div class=grid-item>13</div>
    <div class=grid-item><span style="font-family:Arial">Ξ</span>0.013</div>
    
    <div style="font-family:Karla" class=connection>
      <div class=inner-bg>
        <ConnectionStatus/>
      </div>
    </div>
</div>
  
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: min-content;
  }

  .grid-item {
    padding: 0 .5em 0 .5em;
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
    padding: .8em 1em .8em 1em;
    height: 35px;
    font-size: max(1.4vw, 8x);
    white-space: nowrap;
  }

  .values > .connection {
    background-color: var(--theme-container3);
    display: flex;
    flex-direction: column;
    justify-content: center;

  }

  .values > :first-child {
    border-top-left-radius: var(--border-radius4);
    border-bottom-left-radius: var(--border-radius4);
  }

  .values > :last-child {
    border-top-right-radius: var(--border-radius4);
    border-bottom-right-radius: var(--border-radius4);
  }

</style>

