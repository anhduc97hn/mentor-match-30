// app/api/auth/googlelogin/route.ts
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library"; // Must be installed
import User from "@/models/User"; 
import UserProfile from "@/models/UserProfile";
// Utilities for error handling, response, and constants
import { AppError, catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import { revalidateTag } from "next/cache";

// Environment variables used for Google OAuth and JWT
const CLIENT_ID = process.env.CLIENT_ID as string;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string; 

// Define the handler logic, wrapped by catchAsync
const googleLoginHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
    
    const body = await req.json().catch(() => ({}));
    const { idToken } = body;

    // 1. Setup OAuth2 Client and Verify Token
    const client = new OAuth2Client(CLIENT_ID);
    let response;

    try {
        response = await client.verifyIdToken({
            idToken,
            audience: CLIENT_ID,
        });
    } catch (error) {
        // Handle token verification errors (e.g., token expired, invalid)
        throw new AppError(
            HTTP_STATUS.SERVER_ERROR,
            "Can't connect with your Google account",
            ERROR_TYPES.SERVER_ERROR
        );
    }

    // 401/404 if response is unexpectedly null or verification fails
    if (!response) {
        throw new AppError(
            HTTP_STATUS.SERVER_ERROR,
            "Can't connect with your Google account",
            ERROR_TYPES.SERVER_ERROR
        );
    }

    const payload = response.getPayload() as { email_verified: boolean, name: string, email: string };
    const { email_verified, name, email } = payload;

    // 401 if email not verified
    if (!email_verified) {
        throw new AppError(
            HTTP_STATUS.SERVER_ERROR,
            "Google login failed. Try again",
            ERROR_TYPES.SERVER_ERROR
        );
    }

    // 2. Business Logic (Find or Create User)
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        // A. User does not exist: Create new user
        let password = email + JWT_SECRET_KEY; // Use a generated password
        const newUser = await User.create({ email, password });
        const accessToken = await newUser.generateToken();

        const userProfile = await UserProfile.create({
            userId: newUser._id,
            name,
            isMentor: false, // Default to customer
        });

        await userProfile.populate("userId"); // Populate the linked User data

        revalidateTag(`user-profile-${userProfile.userId._id}`)

        // 3. Return Success Response for NEW user
        return sendResponse(
            HTTP_STATUS.OK,
            true,
            { userProfile, accessToken },
            null,
            "Login successful"
        );
    }

    // B. User exists: Log in
    const accessToken = await existingUser.generateToken();
    const userProfile = await UserProfile.findOne({ userId: existingUser._id }).populate("userId");

    revalidateTag(`user-profile-${userProfile.userId._id}`)

    // 4. Return Success Response for EXISTING user
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        { userProfile, accessToken },
        null,
        "Login successful"
    );
};

// Export the POST method, wrapped by the global error handler
export const POST = catchAsync(googleLoginHandler);