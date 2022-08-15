<script lang="ts">
	import { onMount } from 'svelte';
	import trpcClient from '$lib/client/trpc';

	let greeting = 'Waiting for tRPC response...';

	onMount(() => {
		setTimeout(async () => {
			greeting = await trpcClient.query('hello');
		}, 500);
	});
</script>

<h1>Welcome to T3s</h1>
<p>{greeting}</p>
