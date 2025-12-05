// app/api/userprofiles/me/route.ts
import { NextResponse } from "next/server";
import UserProfile from "@/models/UserProfile";
import { AppError, catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import { UpdateUserProfileSchema } from "@/lib/validation/schemas";
import User from "@/models/User";
import { revalidateTag } from "next/cache";

// Define the handler logic, wrapped by catchAsync
const getCurrentUserHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
    
    // 1. Retrieve the userId from the header injected by middleware.ts
    // This replaces the Express req.userId property
    const userId = req.headers.get('x-user-id'); 

    if (!userId) {
        // This case should be handled by middleware.ts, but is a safety net
        throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Login required", ERROR_TYPES.UNAUTHORIZED);
    }
    
    // 2. Business Logic (Original userProfile.controller.js logic)
    const userProfile = await UserProfile.findOne({ userId: userId }).populate("userId", null, User);

    // 3. Handle 404 Not Found
    if (!userProfile) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found", ERROR_TYPES.NOT_FOUND);
    }

    // 4. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        userProfile,
        null,
        "Get current user successful"
    );
};

// Export the GET method, wrapped by the global error handler
export const GET = catchAsync(getCurrentUserHandler);

const updateProfileHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
    
    // 1. Retrieve the userId from the header injected by middleware.ts
    const userId = req.headers.get('x-user-id'); 

    if (!userId) {
        throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Login required", ERROR_TYPES.UNAUTHORIZED);
    }

    // 2. Validate and Parse Input (Zod)
    const body = await req.json().catch(() => ({}));
    // Zod validates the fields and automatically filters out non-allowed fields
    const updateFields = UpdateUserProfileSchema.parse(body); // Throws ZodError on validation failure

    // 3. Find User Profile
    const userProfile = await UserProfile.findOne({ userId: userId });

    // 4. Handle 404 Not Found
    if (!userProfile) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Account not found", ERROR_TYPES.NOT_FOUND);
    }

    // 5. Apply Updates and Save (Original logic adapted)
    // Instead of looping, we can use Object.keys(updateFields) since Zod already filtered and validated the input.
    Object.assign(userProfile, updateFields);
    
    // Save the updated profile
    await userProfile.save();

    revalidateTag(`user-profile-${userId}`)

    // 6. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        userProfile,
        null,
        "Update Profile successfully"
    );
};

// Export the PUT method, wrapped by the global error handler
export const PUT = catchAsync(updateProfileHandler);