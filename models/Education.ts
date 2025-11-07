import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUserProfile } from './UserProfile';

export interface IEducation extends Document {
  userProfile: Types.ObjectId | IUserProfile;
  degree: string;
  end_year: string;
  field: string;
  description: string;
  url: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema<IEducation>(
  {
    userProfile: { type: Schema.Types.ObjectId, ref: "UserProfile" },
    degree: { type: String, default: "" },
    end_year: { type: String, default: "" },
    field: { type: String, default: "" },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
    isDeleted: {type: Boolean, default: false, required: true}
  },
  { timestamps: true }
);

// const Education = mongoose.model<IEducation>("Education", educationSchema);

const Education = (mongoose.models.Education ||
  mongoose.model("Education", educationSchema));
export default Education;