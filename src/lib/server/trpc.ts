import * as trpc from '@trpc/server';
import type { inferAsyncReturnType } from '@trpc/server';
import prismaClient from './prisma-client';

export const createContext = async () => ({});
export const router = trpc
	.router<inferAsyncReturnType<typeof createContext>>()
	.query('hello', {
		resolve: () => 'tRPC: Greetings!',
	})
	.query('helloWithDelay', {
		resolve: () => {
			return new Promise((resolve) => setTimeout(() => resolve('tRPC: Delayed greetings!'), 2000));
		},
	})
	.query('helloError', {
		resolve: () => {
			throw new trpc.TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'An unexpected error occurred, please try again later.',
				// optional: pass the original error to retain stack trace
				cause: new Error('Something went wrong'),
			});
		},
	})
	.mutation('createExample', {
		resolve: () => prismaClient.example.create({ data: {} }),
	});

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type Router = typeof router;
