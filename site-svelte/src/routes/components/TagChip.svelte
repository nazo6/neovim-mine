<script lang="ts">
	import type { Tag } from '$lib/types/repo';
	import { Chip } from '@svelteuidev/core';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let selectedTag: Writable<string[]> = getContext('selectedTag');

	export let tag: Tag;
	export let text: string | undefined = undefined;

	$: checked = $selectedTag.includes(tag);
</script>

<Chip
	variant="filled"
	{checked}
	on:change={(e) => {
		// @ts-expect-error e.target.checked exists
		if (e.target?.checked) {
			selectedTag.update((pre) => [...pre, tag]);
		} else {
			selectedTag.update((pre) => pre.filter((t) => t != tag));
		}
	}}
>
	{text ?? JSON.parse(tag).join('/')}
</Chip>
