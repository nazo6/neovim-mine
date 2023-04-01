<script lang="ts">
	import type { TagInfo } from '$lib/types/repo';

	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { SortDirection, SortType } from '../type';
	import TagChip from './TagChip.svelte';
	import Select from '$lib/components/Select.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import { VirtualScroll } from 'svelte-virtual-scroll-list';

	export let tagInfo: TagInfo;

	let sortType: Writable<SortType> = getContext('sortType');
	let sortDirection: Writable<SortDirection> = getContext('sortDirection');
	let filter: Writable<string> = getContext('filter');

	const tags = tagInfo.filter((tag) => tag.count >= 2).sort((a, b) => b.count - a.count);
	const tagsSplitted: { data: TagInfo; key: string }[] = [];
	while (tags.length > 0) {
		const tag = tags.splice(0, 5);
		tagsSplitted.push({ data: tag, key: tagsSplitted.length.toString() });
	}
	let filterOpen = true;
</script>

<div class="flex flex-col gap-1">
	<div class="flex flex-col w-full">
		<div class="flex items-center">
			<span class="text-white">Sort type</span>
			<Select
				data={[
					['star', 'star'],
					['created', 'createdAt'],
					['updated', 'lastCommit'],
					['Name(repo)', 'repoName'],
					['Name(owner)', 'ownerName']
				]}
				bind:value={$sortType}
			/>
		</div>
		<div class="flex items-center">
			<span class="text-white">Sort order</span>
			<Select
				data={[
					['asc', 'asc'],
					['desc', 'desc']
				]}
				bind:value={$sortDirection}
			/>
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
			<VirtualScroll key="key" data={tagsSplitted} let:data estimateSize={100} keeps={10}>
				<div class="flex flex-row gap-1 flex-wrap my-1">
					{#each data.data as tag (tag.tag)}
						<TagChip tag={tag.tag} text={`${tag.tag} (${tag.count})`} />
					{/each}
				</div>
			</VirtualScroll>
		</div>
	</div>
</div>
