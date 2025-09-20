import { userModel } from "@/db/schemas";
import { User } from "@/types";
import { TRPCError } from "@trpc/server";

export async function createUser(name: string) {
  const { id } = await userModel.create({ name });

  const user = await getUserById(id);
  return user;
}

//TODO separate transaction errors from trpc errors
export async function getUserById(userId: string): Promise<User> {
  const user = await userModel
    .findById(userId)
    .lean()
    .orFail(() => {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with ID ${userId} could not be found`,
      });
    });

  return user;
}
