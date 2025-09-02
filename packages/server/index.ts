import { router, publicProcedure, createContext } from "@/trpc";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { bankRouter, userRouter, roomRouter } from "./routers";

dotenv.config();

export type AppRouter = typeof appRouter;

const db_url = process.env.DB_CONNECTION_STRING;

if (!db_url) {
  throw new Error("DB url is not defined");
}

//TODO update mongodb allowed ips
mongoose.connect(db_url);
console.log("successfully connected to mongodb");

const appRouter = router({
  hello: publicProcedure.query(() => "hello from server"),
  bank: bankRouter,
  user: userRouter,
  room: roomRouter,
});

const port = process.env.PORT || "3001";
createHTTPServer({
  router: appRouter,
  createContext,
  middleware: cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
}).listen(port);
console.log(`app listening on port ${port}`);
