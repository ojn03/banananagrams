import { isValidObjectId } from "mongoose";
import { userModel } from "../schemas";
import { user } from "@/server/types";

export function createUser(name: string) {
  return userModel.create({ name });
}

export async function getUserById(userId: string): Promise<user> {
  if (!isValidObjectId(userId)) {
    throw new Error("invalid user object id " + userId);
  }

  const maybeUser = await userModel.findById(userId).orFail();

  return maybeUser;
}
