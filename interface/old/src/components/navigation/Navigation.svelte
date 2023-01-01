<script>
    import NavItems from "./NavItems.svelte";
</script>

<div class= nav-section>
    <NavItems/>
</div>

<style>
    .nav-section {
        margin: 15px;
        display: grid;
        grid-template-columns: 1fr max-content 1fr
    }
</style>