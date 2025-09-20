import { initTRPC, TRPCError } from "@trpc/server";
// import superjson from "superjson";

// MAYBE create a context if useful
// @see https://trpc.io/docs/context

export type Context = {};
export const createContext = (): Context => ({});

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  // transformer: superjson
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure
// .use(async ({ ctx, next }) => {
//   const resp = await next({ ctx });

//   if (!resp.ok) {
//     console.log("middleware intercepted error: ");
//     throw new TRPCError(resp.error);
//   }

//   return resp;
// });
