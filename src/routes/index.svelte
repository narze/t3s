<script lang="ts">
	import { onMount } from 'svelte';
	import trpcClient from '$lib/client/trpc';

	let greetingPromise = new Promise(() => {});
	let id: String;
	let loaded = false;

	onMount(() => {
		setTimeout(async () => {
			greetingPromise = trpcClient.query('hello').finally(() => {
				loaded = true;
			});
		}, 500);
	});

	async function createNewExample() {
		const res = await trpcClient.mutation('createExample');
		id = res.id;
	}
</script>

<main>
	<h1 class="text-2xl">T3s - T3 Stack but it's SvelteKit</h1>

	<p>
		{#await greetingPromise}
			Waiting for tRPC response...
		{:then greeting}
			{greeting}
		{/await}
	</p>

	<p>
		{#if loaded}
			{#if id}
				ID: {id}
			{:else}
				<button on:click={createNewExample} class="border border-green-400 rounded px-4 py-2"
					>Create new ID</button
				>
			{/if}
		{/if}
	</p>
</main>

<style lang="postcss">
	main {
		@apply min-h-screen flex flex-col items-center justify-center gap-8;
	}
</style>
