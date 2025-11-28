import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUserProfile } from './UserProfile';

export interface ICertification extends Document {
  userProfile: Types.ObjectId | IUserProfile;
  name: string;
  description: string;
  url: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const certificationSchema = new Schema<ICertification>(
  {
    userProfile: { type: Schema.Types.ObjectId, ref: "UserProfile" },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
    isDeleted: {type: Boolean, default: false, required: true}
  },
  { timestamps: true }
);

// const Certification = mongoose.model<ICertification>("Certification", certificationSchema);

const Certification = (mongoose.models.Certification ||
  mongoose.model("Certification", certificationSchema));
export default Certification;