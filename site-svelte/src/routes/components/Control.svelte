<script lang="ts">
	import type { TagInfo } from '$lib/types/repo';
	import { Button, NativeSelect } from '@svelteuidev/core';
	import { TextInput } from '@svelteuidev/core';

	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { SortDirection, SortType } from '../type';
	import TagChip from './TagChip.svelte';

	export let tagInfo: TagInfo;

	let sortType: Writable<SortType> = getContext('sortType');
	let sortDirection: Writable<SortDirection> = getContext('sortDirection');
	let filter: Writable<string> = getContext('filter');

	let tags = tagInfo.filter((tag) => tag.count >= 2).sort((a, b) => b.count - a.count);
	let filterOpen = true;
</script>

<div class="flex flex-col gap-1">
	<div class="flex flex-col w-full">
		<div class="flex items-center">
			<span class="text-white">Sort type</span>
			<NativeSelect
				data={['star', 'createdAt', 'lastCommit', 'repoName', 'ownerName']}
				class="!text-white"
				bind:value={$sortType}
			/>
		</div>
		<div class="flex items-center">
			<span class="text-white">Sort order</span>
			<NativeSelect data={['asc', 'desc']} bind:value={$sortDirection} />
		</div>
	</div>
	<div>
		<span class="text-white">Search</span>
		<TextInput bind:value={$filter} />
	</div>
	<div>
		<span class="text-white">Filter</span>
		<Button
			on:click={() => {
				filterOpen = !filterOpen;
			}}>Toggle</Button
		>
		<div
			class={`flex flex-row flex-wrap gap-1 h-[70vh] overflow-x-hidden overflow-y-auto ${
				filterOpen ? '' : 'hidden'
			}`}
		>
			{#each tags as tag (tag.tag)}
				<TagChip tag={tag.tag} text={`${JSON.parse(tag.tag).join('/')} (${tag.count})`} />
			{/each}
		</div>
	</div>
</div>
