export interface IDocument {
  _id: string; // MongoDB's unique ID
  createdAt: string; // or Date if you convert it
  updatedAt: string; // or Date
}
export interface Education extends IDocument {
  degree: string;
  field: string;
  description: string;
  end_year: string;
  url: string;
}
export interface Experience extends IDocument {
  company: string;
  industry: string;
  location: string;
  url: string;
  position: Position;
}
export interface Position {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}
export interface Certification extends IDocument {
  name: string;
  description: string;
  url: string | undefined;
}
export interface IMentorFields {
  reviewAverageRating?: number;
  reviewCount: number;
  sessionCount?: number;
  averageReviewRating: number;
  certifications?: Certification[];
  experiences?: Experience[];
  education?: Education[];
}
export interface UserBase extends IDocument {
  email?: string;
  password?: string;
}
export interface IUserProfileBase extends IDocument {
  name?: string;
  userId?: UserBase;
  avatarUrl?: string | File;
  aboutMe?: string;
  city?: string;
  currentCompany?: string;
  currentPosition?: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  twitterLink?: string;
  isMentor: boolean;
}
export interface IMentorProfile extends IUserProfileBase, IMentorFields {}
export interface IRegularUserProfile extends IUserProfileBase {}
/**
 * A Union Type representing any possible User Profile in the application.
 * This is often the type you'll use in your Redux store and many components.
 */
export type UserProfile = IMentorProfile | IRegularUserProfile;
