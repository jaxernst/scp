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
    <div class=grid-item>.003</div>
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
    font-size: 10px;
    margin-bottom: 5px;
  }
  
  .values {
    display: contents;
    font-family: 'Orbitron';
  }
  
  .values > .grid-item {
    background-color: var(--theme-container2);
    padding: .8em 0 .8em 0;
    height: 35px;
  }

  .values > :first-child {
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
  }

  .values > :last-child {
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
  }
</style>

