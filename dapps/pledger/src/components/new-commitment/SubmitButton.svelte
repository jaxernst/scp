<script lang=ts>
  import { connectionError } from "$lib/stores/dAppReady";
  export let onSubmit: () => void;
  export let disabled: boolean = false;

  $: _disabled = disabled || ($connectionError !== null)
</script>

<div class=submit-button-container>
  <button 
      disabled={_disabled}
      class=button-submit
      on:click={onSubmit}
  >
      {$connectionError ?? "Submit ->"}
  </button>
</div>

<style>
   .submit-button-container {
        display: flex;
        justify-content: flex-end;
    }

    .button-submit {
        font-family: 'Orbitron';
        padding: .5em 1em .5em 1em;
        color: var(--theme-color3-dark);
        border-radius: var(--border-radius3);
        transition: background-color .2s, color .4s, box-shadow .8s
    }

    .button-submit:hover {
        background-color: var(--theme-color2);
        color: var(--theme-color1);
        box-shadow: 2px 2px 8px rgba(91, 91, 91, 0.509);
    }

    .button-submit:disabled {
        color: var(--alert-color);
    }
</style>