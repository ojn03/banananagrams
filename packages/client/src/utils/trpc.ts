import  {type  AppRouter } from "@banananagrams/server";
import { createTRPCReact } from "@trpc/react-query";

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpc = createTRPCReact<AppRouter>();

