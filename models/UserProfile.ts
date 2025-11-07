import mongoose, { Schema, Document, Types } from 'mongoose';
// Assuming you will export interfaces from other models:
import { IEducation } from './Education';
import { ICertification } from './Certification';
import { IExperience } from './Experience';
import { IUser } from './User';

export interface IUserProfile extends Document {
  userId: Types.ObjectId | IUser;
  name: string;
  isMentor: boolean;

  avatarUrl: string;
  aboutMe: string;
  city: string;
  
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  twitterLink: string;

  // Use (Types.ObjectId | IModel)[] to support both unpopulated and populated documents
  education: (Types.ObjectId | IEducation)[];
  certifications: (Types.ObjectId | ICertification)[];
  experiences: (Types.ObjectId | IExperience)[];

  currentCompany: string;
  currentPosition: string;
  sessionCount: number;
  reviewCount: number;
  reviewAverageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    isMentor: { type: Boolean, required: true, default: false},

    avatarUrl: { type: String, default: "" },

    aboutMe: { type: String, default: "" },
    city: { type: String, default: "" },
  
    facebookLink: { type: String, default: "https://www.facebook.com/" },
    instagramLink: { type: String, default: "https://www.instagram.com/" },
    linkedinLink: { type: String, default: "https://www.linkedin.com/" },
    twitterLink: { type: String, default: "https://twitter.com/home" },

    education: [{ type: Schema.Types.ObjectId, ref: "Education" }],
    certifications: [{ type: Schema.Types.ObjectId, ref: "Certification" }],
    experiences: [{ type: Schema.Types.ObjectId, ref: "Experience" }],

    currentCompany: { type: String, default: "" },
    currentPosition: { type: String, default: "" },
    sessionCount: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviewAverageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// const UserProfile = mongoose.model<IUserProfile>("UserProfile", userProfileSchema);

    export default mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);

// export default UserProfile;