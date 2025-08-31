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

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { collection: "user" }
);

const userModel = mongoose.model<User>("user", userSchema);

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    room_code: {
      type: String,
      required: true,
      unique: true,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    collection: "room",
  }
);

const roomModel = mongoose.model<Room>("room", roomSchema);

const bankSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "room",
    },
    vault: {
      type: Map,
      of: Number,
      required: true,
    },
  },
  { collection: "bank" }
);

const bankModel = mongoose.model<Bank>("bank", bankSchema);

export { userModel, roomModel, bankModel };
