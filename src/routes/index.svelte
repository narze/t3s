<script lang="ts">
	import { onMount } from 'svelte';
	import trpcClient from '$lib/client/trpc';
	import { writable } from 'svelte/store';

	let id: String;

	const query = useQuery('helloWithDelay');

	async function createNewExample() {
		const res = await trpcClient.mutation('createExample');
		id = res.id;
	}

	// async function createNewError() {
	// 	try {
	// 		const res = await trpcClient.query('helloWithDelay');
	// 		console.log({ res });
	// 		return res;
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// }

	// TODO: Extract to library
	function useQuery(queryName: string) {
		interface UseQueryStore {
			query: any;
			data: any;
			error: any;
			loading: boolean;
		}

		const queryStore = writable<UseQueryStore>({
			query: undefined,
			data: undefined,
			error: undefined,
			loading: true,
		});

		const query = trpcClient.query(queryName as any);

		queryStore.update((store) => {
			store.query = query;
			return store;
		});

		query
			.then((res) => {
				queryStore.update((store) => {
					store.data = res;
					return store;
				});
			})
			.catch((err) => {
				queryStore.update((store) => {
					store.error = err;
					return store;
				});
			})
			.finally(() => {
				queryStore.update((store) => {
					store.loading = false;
					return store;
				});
			});

		return queryStore;
	}
</script>

<main>
	<h1 class="text-2xl">T3s - T3 Stack but it's SvelteKit</h1>

	<p>
		{#await $query.query}
			Waiting for tRPC response...
		{:then data}
			{data}
		{/await}
	</p>

	<p>
		{#if !$query.loading}
			{#if id}
				ID: {id}
			{:else}
				<button on:click={createNewExample} class="border border-green-400 rounded px-4 py-2"
					>Create new ID</button
				>

				<!-- <button on:click={createNewError} class="border border-red-400 rounded px-4 py-2"
					>This button will return error!</button
				> -->
			{/if}
		{/if}
	</p>
</main>

<style lang="postcss">
	main {
		@apply min-h-screen flex flex-col items-center justify-center gap-8;
	}
</style>
