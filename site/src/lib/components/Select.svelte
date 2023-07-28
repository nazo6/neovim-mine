<script lang="ts">
	export let data: [text: string, value: string][];
	export let value: string;
</script>

<select on:change bind:value class={$$props.class}>
	{#each data as item (item[1])}
		<option value={item[1]}>{item[0]}</option>
	{/each}
</select>
