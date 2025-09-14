import mongoose from "mongoose";
import { Bank, Room, User } from "@/types";

/**
 *
 * user:
 * -  name
 * -  id
 *
 * room:
 * - id
 * - room-code
 * - ttl
 * - users
 * - MAYBE host
 *
 * every 24hrs delete all data that's older than a day
 */

// MAYBE convert file to folder with file for each model
// TODO move each user's board state from client to server

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    // socket:
  },
  { collection: "user" }
);

const userModel = mongoose.model<User>("user", userSchema);

const roomSchema = new mongoose.Schema<Room>(
  {
    name: {
      type: String,
      required: true,
    },
    room_code: {
      type: String,
      required: true,
      unique: true,
    },
    host: {
      type: String,
      ref: "user",
      required: true,
    },
    users: [
      {
        type: String,
        ref: "user",
      },
    ],
    hasBegun: {
      type: Boolean,
      ref: "user",
      default: false,
    },
  },
  {
    collection: "room",
  }
);

const roomModel = mongoose.model<Room>("room", roomSchema);

const bankSchema = new mongoose.Schema<Bank>(
  {
    room_code: {
      type: String,
      required: true,
      unique: true,
    },
    vault: {
      type: Map,
      of: Number,
      required: true,
    },
  },
  { collection: "bank" }
);

const bankModel = mongoose.model("bank", bankSchema);

export { userModel, roomModel, bankModel };
