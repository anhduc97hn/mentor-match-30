/**
 * @route GET /userProfiles/:userProfileId
 * @description Get a user profile
 * @access Public
 */

import { NextResponse } from "next/server";
import UserProfile from "@/models/UserProfile";
import { AppError, catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
// import { GetSingleUserParamsSchema, GetSingleUserParams } from "@/lib/validation/schemas"; 
import { z } from "zod";
import { ObjectIdParamSchema } from "@/lib/validation/schemas";

// Define the handler logic, wrapped by catchAsync
// P is the generic type for the context.params object, defined by the Zod schema
const getSingleUserHandler = async (
    req: ExtendedNextRequest,
    context: RouteContext<'/userprofiles/[id]'> 
): Promise<NextResponse> => {
    
    // 1. Validate Dynamic Parameter (context.params)
    // Throws ZodError/AppError on validation failure (invalid ObjectId format)
    const validatedParams = await ObjectIdParamSchema.parse(context.params);
    const { id } = validatedParams;

    // 2. Business Logic (Original userProfile.controller.js logic)
    //
    const userProfile = await UserProfile.findById(id)
        .populate("education")
        .populate("experiences")
        .populate("certifications");
        
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
        ""
    );
};

// Export the GET method, wrapped by the global error handler
export const GET = catchAsync(getSingleUserHandler);