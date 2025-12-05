import type { Metadata } from "next";
import Providers from "./providers";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { UserProfile } from "@/src/types/user";
import UserProfileModel from "@/models/UserProfile";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { unstable_cache } from "next/cache";
export const metadata: Metadata = {
  title: "Mentor Match",
  description: "A Next.js with TS app",
};

export async function getCachedUser(userId: string) {
  const cachedFn = unstable_cache(
    async () => {
      console.log("miss auth check cache"),
      await dbConnect();
      const rawUserProfile = await UserProfileModel.findOne({ userId })
        .populate("userId", null, User)
        .lean();
      
      if (!rawUserProfile) return null;
      return JSON.parse(JSON.stringify(rawUserProfile));
    },
    ['layout-user-profile'], 
    { 
      tags: [`user-profile-${userId}`], 
      revalidate: 3600 
    } 
  );

  // Execute the cached function immediately
  return await cachedFn();
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken")?.value;

  let initialUser: UserProfile | null = null;
  let isAuthenticated = false;
  let isInitialized = true;

  if (token) {
    try {
      const payload = verifyToken(token);
      isAuthenticated = true;
      // await dbConnect();
      // const rawUserProfile = await UserProfileModel.findOne({ userId: payload._id }).populate("userId", null, User).lean();
      // if (rawUserProfile) {
      //   initialUser = JSON.parse(JSON.stringify(rawUserProfile));
      // }
      initialUser = await getCachedUser(payload._id);
    } catch (error) {
      console.error("Layout Auth Error:", error);
      isAuthenticated = false;
    }
  }

  return (
    <html lang="en">
      <body>
        <Providers initialAuthState={{ userProfile: initialUser, isAuthenticated, isInitialized }}>{children}</Providers>
      </body>
    </html>
  );
}
