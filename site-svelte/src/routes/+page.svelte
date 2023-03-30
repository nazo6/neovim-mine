<script lang="ts">
	import RepoList from './components/RepoList.svelte';

	import { setContext } from 'svelte';

	import type { SortDirection, SortType } from './type';
	import Control from './components/Control.svelte';
	import { Burger } from '@svelteuidev/core';
	import { queryParam } from 'sveltekit-search-params';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let sortType = queryParam<SortType>('sort', {
		encode: (v) => v,
		decode: (v) => (v as SortType) ?? 'star'
	});
	let sortDirection = queryParam<SortDirection>('order', {
		encode: (v) => v,
		decode: (v) => (v as SortDirection) ?? 'desc'
	});
	let filter = queryParam(
		'q',
		{
			encode: (v) => v,
			decode: (v) => v ?? ''
		},
		{ pushHistory: false }
	);
	let tagParam = $page.url.searchParams.get('tag');
	let selectedTag = writable(tagParam ? decodeURIComponent(tagParam).split('|') : []);
	$: {
		const tag = $selectedTag;
		$page.url.searchParams.set('tag', encodeURIComponent(tag.join('|')));
		if (browser) {
			window.history.replaceState(null, '', $page.url.toString());
		}
	}

	setContext('sortType', sortType);
	setContext('sortDirection', sortDirection);
	setContext('filter', filter);
	setContext('selectedTag', selectedTag);

	export let data;

	let burgerOpen = false;
</script>

<svelte:head>
	<title>Neovim mine</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="bg-gray-800 h-full flex flex-col">
	<div class="flex flex-row align-center justify-center">
		<Burger
			on:click={() => {
				burgerOpen = !burgerOpen;
			}}
			class="lg:hidden mr-auto"
			opened={burgerOpen}
		/>

		<h1 class="text-center">
			<span
				class="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500"
			>
				Neovim Mine
			</span>
		</h1>
		<div class="lg:hidden ml-auto" />
	</div>
	<div class="flex-shrink min-h-0">
		<div class="h-full flex flex-col lg:flex-row">
			<div class={`lg:w-1/3 ${burgerOpen ? '' : 'max-lg:hidden'}`}>
				<Control tagInfo={data.tagInfo} />
			</div>
			<div class="h-full lg:w-2/3">
				<RepoList repos={data.repos} />
			</div>
		</div>
	</div>
</div>
