import * as trpc from '@trpc/server';
import type { inferAsyncReturnType } from '@trpc/server';
import prismaClient from './prisma-client';

export const createContext = async () => ({});
export const router = trpc
	.router<inferAsyncReturnType<typeof createContext>>()
	.query('hello', {
		resolve: () => 'tRPC: Greetings!',
	})
	.mutation('createExample', {
		resolve: () => prismaClient.example.create({ data: {} }),
	});

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type Router = typeof router;
