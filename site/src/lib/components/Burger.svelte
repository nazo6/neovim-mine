<script lang="ts">
	export let opened: boolean;
	let className: string;
	export { className as class };

	import Icon from 'svelte-icons-pack';
	import AiOutlineMenu from 'svelte-icons-pack/ai/AiOutlineMenu';
	import AiOutlineClose from 'svelte-icons-pack/ai/AiOutlineClose';
</script>

<button class={className} on:click>
	<Icon src={opened ? AiOutlineClose : AiOutlineMenu} className="fill-gray-400" size="2em" />
</button>
