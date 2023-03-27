<script lang="ts">
	export let data;

	import RepoCard from '$lib/component/RepoCard.svelte';
</script>

<h1>Welcome to SvelteKit</h1>

<ul>
	{#each data.repos as repo (repo.url)}
		<li>
			<RepoCard {repo} />
		</li>
	{/each}
</ul>
