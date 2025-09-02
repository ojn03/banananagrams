import { createUser, getUserById } from "@/db/transactions/user";
import { router, publicProcedure } from "@/trpc";
import { isString, isValidOIDString } from "@/validators";

const userRouter = router({
  getUserById: publicProcedure.input(isValidOIDString).query(async (opts) => {
    const { input: userId } = opts;
    const user = await getUserById(userId);
    return user;
  }),

  createUser: publicProcedure.input(isString).mutation(async (opts) => {
    const { input: name } = opts;
    const createdUser = await createUser(name);
    return createdUser;
  }),
});

export default userRouter