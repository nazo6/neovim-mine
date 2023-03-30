<script lang="ts">
	import RepoCard from './RepoCard.svelte';
	import type { RepoInfoWithTag } from '$lib/types/repo';
	import type { SortType, SortDirection } from '../type';
	import VirtualScroll from 'svelte-virtual-scroll-list';

	import { browser } from '$app/environment';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Affix, Button } from '@svelteuidev/core';
	import AiOutlineArrowUp from 'svelte-icons-pack/ai/AiOutlineArrowUp';
	import Icon from 'svelte-icons-pack';

	export let repos: RepoInfoWithTag[];
	let sortType: Writable<SortType> = getContext('sortType');
	let sortDirection: Writable<SortDirection> = getContext('sortDirection');
	let filter: Writable<string> = getContext('filter');
	let selectedTag: Writable<string[]> = getContext('selectedTag');

	$: reposToShow = repos
		.filter((repo) => {
			if ($selectedTag.length == 0) return true;
			return repo.tag.some((tag) => $selectedTag.includes(tag));
		})
		.filter((repo) => {
			if ($filter == '') return true;
			const text = $filter.toLowerCase();
			const basic =
				repo.name.toLowerCase().includes(text) ||
				repo.owner.toLowerCase().includes(text) ||
				repo.tag.some((t) => t.toLowerCase().includes(text));
			let advanced = false;
			if ('data' in repo && !basic) {
				advanced = repo.data.description?.toLowerCase().includes(text) ?? false;
			}
			return basic || advanced;
		})
		.sort((a, b) => {
			const order = $sortDirection == 'asc' ? 1 : -1;

			let fallingback = false;
			if ($sortType == 'star') {
				const aStar = 'data' in a ? a.data.star : 0;
				const bStar = 'data' in b ? b.data.star : 0;
				if (aStar != bStar) {
					return (aStar < bStar ? -1 : 1) * order;
				}
				fallingback = true;
			}
			if ($sortType == 'createdAt') {
				const aDate = 'data' in a ? Date.parse(a.data.createdAt) : 0;
				const bDate = 'data' in b ? Date.parse(b.data.createdAt) : 0;
				if (aDate != bDate) {
					return (aDate < bDate ? -1 : 1) * order;
				}
				fallingback = true;
			}
			if ($sortType == 'lastCommit') {
				const aCommit = 'data' in a ? Date.parse(a.data.lastCommit) : 0;
				const bCommit = 'data' in b ? Date.parse(b.data.lastCommit) : 0;
				if (aCommit != bCommit) {
					return (aCommit < bCommit ? -1 : 1) * order;
				}
				fallingback = true;
			}
			if ($sortType == 'ownerName') {
				if (a.owner != b.owner) {
					return (a.owner.toLowerCase() < b.owner.toLowerCase() ? -1 : 1) * order;
				}
				fallingback = true;
			}
			if ($sortType == 'repoName' || fallingback) {
				return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * order;
			}

			throw Error('Unknown sort type');
		});

	let virtualScroll: any;
	let scrollY = 0;
</script>

{#if browser}
	<VirtualScroll
		key="url"
		data={reposToShow}
		let:data
		estimateSize={50}
		on:scroll={() => (scrollY = virtualScroll.getOffset())}
		bind:this={virtualScroll}
	>
		<div class="scrollbar-thin">
			<RepoCard repo={data} />
		</div>
	</VirtualScroll>
{/if}

<Affix position={{ bottom: 20, right: 20 }}>
	{#if scrollY > 0}
		<Button on:click={() => virtualScroll.scrollToIndex(0)}>
			<svelte:fragment slot="leftIcon">
				<Icon src={AiOutlineArrowUp} />
			</svelte:fragment>
			Scroll to top
		</Button>
	{/if}
</Affix>
