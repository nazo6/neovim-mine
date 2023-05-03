<script lang="ts">
	import '../app.css';

	import { MetaTags } from 'svelte-meta-tags';

	import { PUBLIC_GA_MEASUREMENT_ID } from '$env/static/public';

	/* eslint-disable */
	const gaScript = `<script>
    window.dataLayer = window.dataLayer || []
    function gtag() {dataLayer.push(arguments)}
    gtag('js', new Date())
    gtag('config', '${PUBLIC_GA_MEASUREMENT_ID}')<\/script>`;
	/* eslint-enable */
</script>

<svelte:head>
	{@html gaScript}
	<script async src={`https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GA_MEASUREMENT_ID}`}>
	</script>
</svelte:head>
<MetaTags
	title="Neovim Mine"
	description="Neovim Mine is a website that lets you find neovim plugins. You can browse and search them."
/>
<slot />
