<script>
    export let label = "label"
</script>
    
<div class="box">
    <span class="label">{label}</span>
</div>

<style>
    
.box {
    width: 100%;
    margin: 0px;
    position: relative;
    padding: 0.5em;
}

.box span {
    position: relative;
    display: flex;
    white-space: nowrap;
    right: 0;
    left: 0;
    align-items: center;
    color: var(--theme-color1);
    font-size: var(--font-xsmall);
}

.box span:before{
    margin-right: 15px;
}
.box span:after {
    margin-left: 15px;
}
.box span:before , .box span:after {
    content: ' ';
    height: 1px;
    background: var(--theme-color1);
    display: block;
    width: 50%;
}
</style>