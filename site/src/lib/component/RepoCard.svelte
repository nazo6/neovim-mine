<script lang="ts">
	import type { RepoType } from '../../routes/+page.server';

	export let repo: RepoType;
</script>

<div class="items-center bg-white border border-gray-200 rounded-lg shadow">
	<div class="flex flex-col justify-between p-4 leading-normal">
		<p><span class="text-gray-700">{repo.owner}</span>/{repo.name}</p>
		{#if 'data' in repo}
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
				{repo.data.description ?? ''}
			</p>
		{:else}{/if}
	</div>
</div>
