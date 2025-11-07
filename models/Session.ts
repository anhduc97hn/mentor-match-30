import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUserProfile } from './UserProfile';

export type SessionStatus = "pending" | "accepted" | "declined" | "completed" | "cancelled" | "reviewed";

export interface ISession extends Document {
  from: Types.ObjectId | IUserProfile;
  to: Types.ObjectId | IUserProfile;
  status: SessionStatus;
  topic: string;
  problem: string;
  startDateTime: Date;
  endDateTime: Date;
  gEventLink: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    from: { type: Schema.Types.ObjectId, required: true, ref: "UserProfile" },
    to: { type: Schema.Types.ObjectId, required: true, ref: "UserProfile" },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed", "cancelled", "reviewed"],
      required: true,
    },
    topic: { type: String, required: true },
    problem: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    gEventLink: { type: String, default: "" },
  },
  { timestamps: true }
);

const Session = mongoose.model<ISession>("Session", sessionSchema);
export default Session;