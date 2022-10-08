<script>
    export let label = "label"
</script>

<div class="container">
    <div>
        <div class="label-line">
            <h>{label}</h>
        </div>
    </div>
    <slot></slot>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
    }

    h {
        padding: 2px;
        color: var(--text-color1);
        font-size: var(--font-small);
    }

    .label-line {
        width: 100%;
        border-bottom: 1px solid var(--text-color2);
        margin-bottom: .5em;
    }
</style>