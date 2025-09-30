import mongoose from "mongoose";
import { Bank, Room, User } from "@/types";

// TODO move each user's board state from client to server
// TODO implement ttls to delete all data related to a room after 24hrs
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
