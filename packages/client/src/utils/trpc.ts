import { type AppRouter } from "@banananagrams/server";
//TODO make it so we dont add the whole server as a dependency
import { createTRPCReact } from "@trpc/react-query";

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpc = createTRPCReact<AppRouter>();
