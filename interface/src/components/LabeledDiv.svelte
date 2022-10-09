<script>
    export let label = "label"
</script>

<div class="container">
    <div class="label-box">
        <h>{label}</h>
    </div>
    <div class="wrapper">
        <slot></slot>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
    }

    h {
        padding: 2px;
        color: var(--theme-color1);
        font-size: var(--font-small);
    }
    
    .label-box {
        width: 100%;
        margin-bottom: .5em;
        position: relative;
        left: 20px;
    }

    .wrapper {
        border: 1px solid white;
        border-radius: 20px;
    }
</style>