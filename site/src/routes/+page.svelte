<script lang="ts">
	import RepoList from './components/RepoList.svelte';

	import { setContext } from 'svelte';

	import type { SortDirection, SortType } from './type';
	import Control from './components/Control.svelte';
	import { arrayQueryParamStore, queryParamStore } from '$lib/utils/queryParam';

	import { PUBLIC_GOOGLE_SITE_VERIFICATION } from '$env/static/public';
	import Burger from '$lib/components/Burger.svelte';

	let sortType = queryParamStore<SortType>('sort', 'star');
	let sortDirection = queryParamStore<SortDirection>('order', 'desc');
	let filter = queryParamStore('filter', '');
	let selectedTag = arrayQueryParamStore('tag', []);

	setContext('sortType', sortType);
	setContext('sortDirection', sortDirection);
	setContext('filter', filter);
	setContext('selectedTag', selectedTag);

	export let data;

	let burgerOpen = false;
</script>

<svelte:head>
	<meta name="google-site-verification" content={PUBLIC_GOOGLE_SITE_VERIFICATION} />
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
