import mongoose from "mongoose";
import { room, user } from "../types";

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

const userModel = mongoose.model<user>("user", userSchema);

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

const roomModel = mongoose.model<room>("room", roomSchema);

const bankSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "room",
    },
    vault: {
      type: new mongoose.Schema(
        {
          letter: { type: String, reequired: true },
          count: { type: Number, required: true },
        },
        { _id: false }
      ),
      required: true,
    },
  },
  { collection: "bank" }
);

const bankModel = mongoose.model("bank", bankSchema);

export { userModel, roomModel, bankModel };
