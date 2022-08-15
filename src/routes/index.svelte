<script lang="ts">
	import { onMount } from 'svelte';
	import trpcClient from '$lib/client/trpc';

	let greeting = 'Waiting for tRPC response...';
	let id: String;
	let loaded = false;

	onMount(() => {
		setTimeout(async () => {
			greeting = await trpcClient.query('hello');
			loaded = true;
		}, 500);
	});

	async function createNewExample() {
		const res = await trpcClient.mutation('createExample');
		id = res.id;
	}
</script>

<h1>Welcome to T3s</h1>

<p>{greeting}</p>

{#if loaded}
	{#if id}
		<p>ID: {id}</p>
	{:else}
		<p><button on:click={createNewExample}>Create new ID</button></p>
	{/if}
{/if}
