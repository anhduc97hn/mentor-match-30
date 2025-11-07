// app/api/sessions/route.ts
import { NextResponse } from "next/server";
import UserProfile from "@/models/UserProfile";
import Session from "@/models/Session";
import { AppError, catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import { GetSessionsQuerySchema, GetSessionsQuery } from "@/lib/validation/schemas"; 

const getSessionListHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
    
    // 1. Authentication Check & User ID Retrieval
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Login required", ERROR_TYPES.UNAUTHORIZED);
    }
    
    // 2. Validate Query Parameters (status, page, limit)
    const queryParams = Object.fromEntries(req.nextUrl.searchParams);
    const validatedQuery = GetSessionsQuerySchema.parse(queryParams); // Throws ZodError on bad input
    
    const { page, limit, status } = validatedQuery;
    
    // 3. Get Current User's Profile ID (needed for filtering)
    const userProfile = await UserProfile.findOne({ userId: userId });
    
    if (!userProfile) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "User profile not found", ERROR_TYPES.NOT_FOUND);
    }
    const userProfileId = userProfile._id;
    
    // 4. Filtering Criteria (Based on original controller logic)
    // Filters by status AND (from: user OR to: user)
    const filterConditions: any[] = [
        { status: status },
        { $or: [{ from: userProfileId }, { to: userProfileId }] },
    ];

    const filterCriteria = filterConditions.length
        ? { $and: filterConditions }
        : {};

    // 5. Pagination Setup
    const count = await Session.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    // 6. Fetch Sessions with Population
    // Populates both 'from' and 'to' fields
    const sessions = await Session.find(filterCriteria)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("from")
        .populate("to");

    // 7. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        { sessions, totalPages, count },
        null,
        null
    );
};

// Export the GET method, wrapped by the global error handler
export const GET = catchAsync(getSessionListHandler);