<script lang="ts">
	export let value: string;
</script>

<input bind:value on:change class={$$props.class} />
