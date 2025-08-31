import { userModel } from "@/db/schemas";
import { User } from "@/types";

export async function createUser(name: string) {
  return await userModel.create({ name });
}

export async function getUserById(userId: string): Promise<User> {
  const user = await userModel.findById(userId).orFail();

  return user;
}
