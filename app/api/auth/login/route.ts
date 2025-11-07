/**
 * @route POST /auth/login
 * @description Log in with email and password
 * @access Public
 */

// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// Assuming you have converted models to TypeScript and they are exported as defaults
import User from "@/models/User"; 
import UserProfile from "@/models/UserProfile";
// Utilities for error handling, response, and constants
import { AppError, catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper"
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
// Zod schema for input validation
import { LoginSchema } from "@/lib/validation/schemas"; 
import { z } from "zod";

// Define the handler logic, wrapped by catchAsync
const loginHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
    
    // 1. Validate Input (Replaces express-validator)
    const body = await req.json().catch(() => ({}));
    const validatedBody = LoginSchema.parse(body); // Throws ZodError on failure, caught by catchAsync

    const { email, password } = validatedBody; // Validated and typed data

    // 2. Business Logic (Original auth.controller.js logic)

    // Find user by email, selecting password
    let user = await User.findOne({ email }, "+password");

    // 404 if user not found
    if (!user) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Invalid credentials", ERROR_TYPES.NOT_FOUND);
    }

    // Compare passwords
    // Note: Assuming User model conversion included the IUserMethods for generateToken
    const isMatch = await bcrypt.compare(password, user.password as string);

    // 400 if password wrong
    if (!isMatch) {
        throw new AppError(HTTP_STATUS.BAD_REQUEST, "Wrong password", ERROR_TYPES.BAD_REQUEST);
    }

    // Generate token
    const accessToken = await user.generateToken();

    // Get user profile and populate userId
    const userProfile = await UserProfile.findOne({ userId: user._id }).populate("userId");

    // 3. Return Success Response (Replaces Express res.status().json())
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        { userProfile, accessToken },
        null,
        "Login successful"
    );
};

// Export the POST method, wrapped by the global error handler
export const POST = catchAsync(loginHandler);