import type { Router } from '$lib/server/trpc'; // 👈 only the types are imported from the server
import * as trpc from '@trpc/client';

export default trpc.createTRPCClient<Router>({ url: '/trpc' });
