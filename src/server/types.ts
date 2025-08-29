import { Types } from "mongoose";

export interface user {
  _id: Types.ObjectId;
  name: string;
}

export interface room {
  _id: Types.ObjectId
  name: string;
  room_code: string;
  users: user[];
}
