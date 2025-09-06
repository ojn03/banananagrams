import { userModel } from "@/db/schemas";
import { User } from "@/types";

export async function createUser(name: string) {
  const { id } = await userModel.create({ name });

  const user = await getUserById(id);
  return user;
}

export async function getUserById(userId: string): Promise<User> {
  const user = await userModel
    .findById(userId)
    .lean()
    .orFail(() => {
      throw new Error(`User with ID ${userId} could not be found`);
    });

  return user;
}
