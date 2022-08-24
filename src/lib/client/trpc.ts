import type { Router } from '$lib/server/trpc'; // 👈 only the types are imported from the server

import * as trpc from '@trpc/client';

const trpcClient = trpc.createTRPCClient<Router>({ url: '/trpc' });

export type TRPCClientType = typeof trpcClient;

export default trpcClient;
