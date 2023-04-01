<script lang="ts">
	export let domain: string;

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import IoLogoGithub from 'svelte-icons-pack/io/IoLogoGithub';
	import IoLogoGitlab from 'svelte-icons-pack/io/IoLogoGitlab';
	import FiExternalLink from 'svelte-icons-pack/fi/FiExternalLink';
</script>

<div class="flex flex-row items-center gap-1">
	{#if domain == 'github.com'}
		<Icon src={IoLogoGithub} color="white" />
	{:else if domain == 'gitlab.com'}
		<Icon src={IoLogoGitlab} color="white" />
	{:else}
		<span class="text-sm">{domain}</span>
	{/if}
	<Icon src={FiExternalLink} color="white" />
</div>
