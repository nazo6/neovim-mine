<script lang="ts">
	import type { RepoInfoWithTag } from '$lib/types/repo';

	import RepoLinkIcon from '$lib/components/RepoLinkIcon.svelte';
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import IoStar from 'svelte-icons-pack/io/IoStar';
	import TagChip from '../../routes/components/TagChip.svelte';
	import RelativeDate from './RelativeDate.svelte';

	export let repo: RepoInfoWithTag;
</script>

<div class="m-1">
	<div
		class="w-full rounded-md bg-gray-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 p-0.5 group"
	>
		<div class="h-full rounded-md w-full bg-gray-800 text-white px-2 py-1">
			<div class="flex flex-auto flex-row justify-between items-center gap-1 flex-wrap">
				<div class="text-lg font-bold mr-auto">
					<a
						href={repo.url}
						target="_blank"
						class="hover:underline flex flex-row items-center gap-1"
					>
						<div>
							<span class="text-blue-400"> {repo.owner}/</span><span class="text-blue-200"
								>{repo.name}</span
							>
						</div>

						<RepoLinkIcon domain={repo.domain} />
					</a>
				</div>
				{#if 'data' in repo}
					<div class="text-sm flex flex-row gap-2">
						<div>
							Create: <RelativeDate date={repo.data.createdAt} />
						</div>
						<div>
							Update: <RelativeDate date={repo.data.lastCommit} />
						</div>
					</div>
					<div class="basis-1/6 md:basis-1/12 flex items-center">
						<Icon src={IoStar} className="mr-1" color="yellow" />
						{repo.data.star}
					</div>
				{/if}
			</div>

			<div
				class="border-t-2 group-hover:border-t-orange-400 font-normal text-gray-300 flex flex-col"
			>
				{#if 'data' in repo && repo.data.description}
					<p>{repo.data.description}</p>
				{/if}
				<div class="flex flex-row flex-wrap gap-1 mt-0.5">
					{#each repo.tag as tag (tag)}
						<TagChip {tag} />
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
