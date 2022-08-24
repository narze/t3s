<script lang="ts">
	import trpcClient, { type TRPCClientType } from '$lib/client/trpc';
	import { writable, type Writable } from 'svelte/store';
	import type { InferQueries, InferQuery, InferQueryOutput, TQuery } from '$lib/server/trpc-helper';
	import type { TRPCClient } from '@trpc/client';

	let id: String;

	const helloQuery = useQuery('hello');
	const query1 = $helloQuery.query; // Should have type CancellablePromise<string>
	console.log({ query1 });
	query1.cancel();

	const helloWithDelayQuery = useQuery('helloWithDelay');
	const query2 = $helloWithDelayQuery.query; // Should have type CancellablePromise<string>

	const helloErrorQuery = useQuery('helloError');
	const query3 = $helloErrorQuery.query; // Should have type CancellablePromise<never>

	const helloNumberQuery = useQuery('helloNumber');
	const query4 = $helloNumberQuery.query; // Should have type CancellablePromise<number>

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
	interface UseQueryStore<T extends TQuery> {
		// FIXME: query type should receive a generic type
		// query: ReturnType<InferQuery<T>['call']>; // This returns Promise, not CancellablePromise, and also cause type error
		query: ReturnType<TRPCClientType['query']>; // This works, but types are merged
		data?: InferQueryOutput<T>;
		error: unknown;
		loading: boolean;
	}

	function useQuery<T extends TQuery>(queryName: T): Writable<UseQueryStore<T>> {
		const query = trpcClient.query<InferQueries, TQuery>(queryName); // Don't know why I cannot use T here...

		const queryStore = writable<UseQueryStore<TQuery>>({
			query: query,
			data: undefined,
			error: undefined,
			loading: true,
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
		{#await $helloWithDelayQuery.query}
			Waiting for tRPC response...
		{:then data}
			{data}
		{/await}
	</p>

	<p>
		{#if !$helloWithDelayQuery.loading}
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
