/**
 * @route POST /user/signup
 * @description Register new user
 * @access Public
 */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User"; 
import UserProfile from "@/models/UserProfile";
// Utilities for error handling, response, and constants
import { AppError, catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
// Zod schema for input validation
import { SignUpSchema } from "@/lib/validation/schemas"; 
import { revalidateTag } from "next/cache";

// Define the handler logic, wrapped by catchAsync
const signupHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
    
    // 1. Validate Input (Zod)
    const body = await req.json().catch(() => ({}));
    // Throws ZodError on failure, caught by catchAsync
    const validatedBody = SignUpSchema.parse(body); 

    let { name, email, password, isMentor } = validatedBody; 

    // 2. Business Logic (Original user.controller.js logic)

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
        throw new AppError(HTTP_STATUS.CONFLICT, "User already exists", ERROR_TYPES.CONFLICT);
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new record in User collection
    user = await User.create({
        email,
        password: hashedPassword,
    });
    const accessToken = await user.generateToken();

    if (isMentor) revalidateTag("mentors");

    // Create a new record in UserProfile collection
    const userProfile = await UserProfile.create({
        userId: user._id,
        // isMentor is set here; if not present in body, Mongoose default (false) applies
        isMentor, 
        name,
    });

    await userProfile.populate("userId"); // Populate the linked User data

    // 3. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        { userProfile, accessToken },
        null,
        "Create user successful"
    );
};

// Export the POST method, wrapped by the global error handler
export const POST = catchAsync(signupHandler);