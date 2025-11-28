import dbConnect from "@/lib/dbConnect";
import Certification from "@/models/Certification";
import Education from "@/models/Education";
import Experience from "@/models/Experience";
import UserProfileModel from "@/models/UserProfile";
import apiService from "@/src/appService/apiService";
import { UserProfile } from "@/src/types/user";

interface FeaturedUserProfilesData {
  userProfiles: UserProfile[];
  userProfilesById: Record<string, UserProfile>;
  currentHomePageUsers: string[];
}

export async function fetchFeaturedMentors(): Promise<FeaturedUserProfilesData> {
  try {
    // const response = await apiService.get<any, { data: { userProfiles: UserProfile[] } }>(`/userprofiles/featured`, { params: {limit: 9} });
    // direct db call
    await dbConnect();
    const userProfiles = await UserProfileModel.find({ isMentor: true })
      .sort({ sessionCount: -1 })
      .limit(9);
    const userProfilesById: Record<string, UserProfile> = {};
    const currentHomePageUsers: string[] = [];

    userProfiles.forEach((userProfile) => {
      userProfilesById[userProfile._id] = userProfile;
      currentHomePageUsers.push(userProfile._id);
    });

    return {
      userProfiles: userProfiles,
      userProfilesById: userProfilesById,
      currentHomePageUsers: currentHomePageUsers,
    };
  } catch (error) {
    // In a Server Component, you generally throw errors, handle them in error.tsx,
    // or return a safe default, rather than calling toast.
    console.error("Failed to fetch featured mentors:", error);
    // Return an empty set if fetching fails
    return { userProfiles: [], userProfilesById: {}, currentHomePageUsers: [] };
  }
}

interface UserProfileData {
  userProfiles: UserProfile[];
  currentPageUsers: string[]; // array of IDs
  userProfilesById: Record<string, any>; // map of ID to full user profile object
  total: number;
  totalPages: number;
}

export async function getUserProfilesServer(page = 1, limit = 10): Promise<UserProfileData> {
  try {
    // const response = await apiService.get(`/userprofiles/`, { params });
    // const userProfiles = response.data.userProfiles as UserProfile[];
    await dbConnect();

    const skip = (page - 1) * limit;
    const [rawUserProfiles, count] = await Promise.all([UserProfileModel.find({ isMentor: true }).populate("education").populate("experiences").populate("certifications").sort({ reviewAverageRating: -1 }).skip(skip).limit(limit).lean(), UserProfileModel.countDocuments({ isMentor: true })]);
    const userProfilesById: Record<string, UserProfile> = {};
    const currentPageUsers: string[] = [];

    const userProfiles = JSON.parse(JSON.stringify(rawUserProfiles)) as UserProfile[];

    userProfiles.forEach((userProfile) => {
      userProfilesById[userProfile._id] = userProfile;
      currentPageUsers.push(userProfile._id);
    });

    const totalPages = Math.ceil(count / 10);

    return {
      userProfiles: userProfiles,
      userProfilesById: userProfilesById,
      currentPageUsers: currentPageUsers,
      total: count,
      totalPages: totalPages,
    };
  } catch (error) {
    console.error("Server-side mentor fetch error:", error);
    return {
      userProfiles: [],
      currentPageUsers: [],
      userProfilesById: {},
      total: 0,
      totalPages: 0,
    };
  }
}

import { IMentorProfile } from "@/src/types/user";

export async function getMentorProfileServer(mentorId: string): Promise<IMentorProfile | null> {
  try {
    // const response = await apiService.get(`/userprofiles/${mentorId}`);
    // const userProfile = response.data;
    await dbConnect();
    const rawUserProfile = await UserProfileModel.findById(mentorId).populate("education").populate("experiences").populate("certifications").lean();

    const userProfile = JSON.parse(JSON.stringify(rawUserProfile));
    return userProfile;
  } catch (error) {
    console.error("Server-side mentor fetch error:", error);
    return null;
  }
}
