import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUserProfile } from './UserProfile';

export interface IPosition {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface IExperience extends Document {
  userProfile: Types.ObjectId | IUserProfile;
  company: string;
  industry: string;
  location: string;
  url: string;
  position: IPosition;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const positionSchema = new Schema<IPosition>(
    {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      start_date: { type: String, default: "" },
      end_date: { type: String, default: "" },
    },
    { _id: false } // Prevent Mongoose from creating an _id for the subdocument
);

const experienceSchema = new Schema<IExperience>(
  {
    userProfile: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    company: { type: String, default: "" },
    industry: { type: String, default: "" },
    location: { type: String, default: "" },
    url: { type: String, default: "" },
    position: {
      type: positionSchema,
      default: {}, // Default to an empty object for subdocuments
    },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

// const Experience = mongoose.model<IExperience>("Experience", experienceSchema);

const Experience = (mongoose.models.Experience ||
  mongoose.model("Experience", experienceSchema));

export default Experience;