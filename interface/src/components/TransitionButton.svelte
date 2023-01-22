<script lang=ts>
	import { cubicOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),
    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;
      return {
        duration: 600,
        easing: cubicOut,
        css: t => `
          transform: ${transform} scale(${t});
          opacity: ${t}
        `
      };
    }
  });

	let hovered = false;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	class="container"
	on:mouseover={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
>
	{#if !hovered}
		<button 
			class="button-primary" 
			in:receive={{key:'1'}}
			out:send={{key:'1'}} 
		>
		<slot name="noHover"/>
	</button>
	{:else}
		<button 
			class="button-primary" 
			in:send={{key:'1'}}
			out:receive={{key:'1'}}
		>
			<slot name="hover"/>
		</button>
	{/if}
</div>