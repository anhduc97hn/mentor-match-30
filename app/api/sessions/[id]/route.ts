// app/api/sessions/[sessionId]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { google } from "googleapis";
import Session from "@/models/Session"; 
import UserProfile from "@/models/UserProfile";
import { AppError, catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import {  UpdateSessionStatusSchema,  ObjectIdParamSchema } from "@/lib/validation/schemas"; 

// --- Environment Variables and Google OAuth Setup ---
//
const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URL = process.env.REDIRECT_URL as string; 
const scopes = ['https://www.googleapis.com/auth/calendar'];

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

// --- Helper Function: calculateSessionCount (Adapted from session.controller.js) ---
// This function updates the mentor's sessionCount based on completed sessions.
const calculateSessionCount = async (userProfileId: string) => {
    // Filter for sessions where the user is the mentor (to) and status is completed
    const filterConditions = [{ to: userProfileId, status: "completed" }];

    const filterCriteria = filterConditions.length
        ? { $and: filterConditions }
        : {};

    const sessionCount = await Session.countDocuments(filterCriteria);
    
    // Update the UserProfile document
    await UserProfile.findByIdAndUpdate(userProfileId, {
        sessionCount: sessionCount,
    });
};


const reactSessionRequestHandler = async (
    req: ExtendedNextRequest,
    context: RouteContext<'/sessions/[id]'> 
): Promise<NextResponse> => {
    
    // 1. Authentication Check & User ID Retrieval
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Login required", ERROR_TYPES.UNAUTHORIZED);
    }
    
    // 2. Validate Dynamic Parameter (sessionId)
    const validatedParams = ObjectIdParamSchema.parse(context.params);
    const { id } = validatedParams;
    
    // 3. Validate Body (status)
    const body = await req.json().catch(() => ({}));
    const validatedBody = UpdateSessionStatusSchema.parse(body);
    const { status } = validatedBody;

    // 4. Find Session
    let session = await Session.findById(id);

    if (!session) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Session Request not found", ERROR_TYPES.NOT_FOUND);
    }
 
    // 5. Update Status
    session.status = status;

    // 6. Handle "accepted" status (Google OAuth URL generation)
    if (status === "accepted") {
        const state = session._id as string;
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
            state: state
        });
        session.gEventLink = url;
    }

    // 7. Save Session
    await session.save();

    // 8. Recalculate Session Count (if status was 'completed', this is necessary)
    const toUserProfileId = session.to.toString(); 
    await calculateSessionCount(toUserProfileId);

    // 9. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        session,
        null,
        "Update Session successfully"
    );
};

// Export the PUT method, wrapped by the global error handler
export const PUT = catchAsync(reactSessionRequestHandler);