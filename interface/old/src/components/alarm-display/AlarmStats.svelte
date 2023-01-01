<script>
    import IoMdPeople from 'svelte-icons/io/IoMdPeople.svelte'
    import FaMoneyCheckAlt from 'svelte-icons/fa/FaMoneyCheckAlt.svelte'
    import IoMdAlarm from 'svelte-icons/io/IoMdAlarm.svelte'

    let nextWakeup = "8:30am"
    let amountStaked = "3.4"
    let poolMembers = 10
</script>

<div class="row">

    <div class="stacked">
        <div class="icon">
            <IoMdPeople/>
        </div>
        <div class="label">{poolMembers} members</div>
    </div>
    
    <div class="stacked">
        <div class="icon">
            <FaMoneyCheckAlt/>
        </div>
        <div class="label">{amountStaked} eth staked</div>
    </div>

    <div class="stacked">
        <div class="icon">
            <IoMdAlarm/>
        </div>
        <div class="label">{nextWakeup}</div>
    </div>
</div>
    
    
<style>
    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }

    .stacked {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1em;
    }

    .icon {
    color: white;
    width: 32px;
    height: 32px;
  }

  .label {
    color: var(--theme-color1);
    font-size: var(--font-small);
  }
</style>