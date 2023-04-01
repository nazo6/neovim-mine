<script lang="ts">
	import type { Tag } from '$lib/types/repo';
	import Chip from '$lib/components/Chip.svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let selectedTag: Writable<string[]> = getContext('selectedTag');

	export let tag: Tag;
	export let text: string | undefined = undefined;

	$: checked = $selectedTag.includes(tag);
</script>

<Chip
	{checked}
	on:change={(e) => {
		checked = !checked;
		if (checked) {
			console.log('checked', tag);
			selectedTag.update((pre) => [...pre, tag]);
		} else {
			console.log('unchecked', tag);
			selectedTag.update((pre) => pre.filter((t) => t != tag));
		}
	}}
	text={text ?? tag}
/>
