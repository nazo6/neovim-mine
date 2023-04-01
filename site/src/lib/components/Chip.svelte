<script lang="ts">
	import Icon from 'svelte-icons-pack';
	import AiOutlineCheck from 'svelte-icons-pack/ai/AiOutlineCheck';

	export let checked: boolean;
	export let text: string;
</script>

<label class="cursor-pointer">
	<input type="checkbox" class="hidden" on:change />
	<span
		class={`rounded-full px-2 inline-flex flex-row items-center gap-1 text-gray-200 ${
			checked ? 'bg-sky-800' : 'bg-gray-700 hover:bg-gray-600'
		}`}
	>
		{text}
		{#if checked}
			<Icon src={AiOutlineCheck} className="fill-sky-400" />
		{/if}
	</span>
</label>
