import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

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

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
  },
  { collection: "users" }
);

const userModel =  mongoose.model('users', userSchema)

const roomSchema = new mongoose.Schema(
  {
    name: { type: String },
    room_code: {
      type: String,
      unique: true,
    },
  },
  {
    collection: "rooms",
  }
);

const roomModel = mongoose.model('rooms', roomSchema)

export{userModel, roomModel}
