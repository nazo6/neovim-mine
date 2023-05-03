<script lang="ts">
	import { page } from '$app/stores';
	export let data;

	$: repo = data.repos.find(
		(repo) => repo.name == $page.params.name && repo.owner == $page.params.owner
	)!;
</script>

<div>
	{repo.name}
</div>
