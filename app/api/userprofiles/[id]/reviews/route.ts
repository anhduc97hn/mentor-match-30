/**
 * @route GET /userProfiles/:userProfileId/reviews
 * @description Get all reviews of a mentor
 * @access Public
 */

// app/api/userprofiles/[userProfileId]/reviews/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import UserProfile from "@/models/UserProfile";
import Session from "@/models/Session";
import Review from "@/models/Review";
import { AppError, catchAsync, sendResponse, ExtendedNextRequest, AppRouterContext } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import { ObjectIdParamSchema, PaginationQuerySchema } from "@/lib/validation/schemas";
import { unstable_cache } from "next/cache";
// import { GetSingleUserParamsSchema, PaginationQuerySchema, GetSingleUserParams, PaginationQuery } from "@/lib/validation/schemas"; 

// Define the handler logic, wrapped by catchAsync
const getReviewsHandler = async (
    req: ExtendedNextRequest,
    context: AppRouterContext<{id: string}>
): Promise<NextResponse> => {
    
    // 1. Validate Dynamic Parameter (userProfileId)
    const params = await context.params;
    const validatedParams = ObjectIdParamSchema.parse(params);
    const { id } = validatedParams;

    // 2. Validate Query Parameters (page, limit)
    const queryParams = Object.fromEntries(req.nextUrl.searchParams);
    const { page, limit } = PaginationQuerySchema.parse(queryParams);
/*
    // 3. Find Mentor Profile and Handle 404
    const mentorProfile = await UserProfile.findById(id);
    if (!mentorProfile) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Mentor not found", ERROR_TYPES.NOT_FOUND);
    }

    // 4. Find Sessions associated with the mentor
    const sessionsOfMentor = await Session.find({ to: id});
    const sessionIds = sessionsOfMentor.map((session) => session._id);

    // 5. Pagination Setup
    const count = await Review.countDocuments({ session: { $in: sessionIds } });
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    // 6. Fetch Reviews
    const reviews = await Review.find({ session: { $in: sessionIds } })
        .populate({
            path: "session",
            // Populate 'from' and 'to' fields within the populated session
            populate: [{ path: "from" }, { path: "to" }],
        })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
*/
const getCachedReviewsData = unstable_cache(
        async () => {
            // 3. Find Mentor Profile (Moved inside cache to save DB call)
            // used .lean() for faster performance
            const mentorProfile = await UserProfile.findById(id).lean();
            
            if (!mentorProfile) {
                return null; // Signal to the handler that it wasn't found
            }

            // 4. Find Sessions associated with the mentor
            // Optimization: .select("_id") only fetches IDs, much faster
            const sessionsOfMentor = await Session.find({ to: id }).select("_id").lean();
            const sessionIds = sessionsOfMentor.map((session) => session._id);

            // 5. Pagination Setup
            const count = await Review.countDocuments({ session: { $in: sessionIds } });
            const totalPages = Math.ceil(count / limit);
            const offset = limit * (page - 1);

            // 6. Fetch Reviews
            // Added .lean() because unstable_cache requires plain JSON objects
            const reviews = await Review.find({ session: { $in: sessionIds } })
                .populate({
                    path: "session",
                    populate: [{ path: "from" }, { path: "to" }],
                })
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .lean();

            // Return clean serializable data
            return {
                reviews: JSON.parse(JSON.stringify(reviews)), // Extra safety for ObjectIds/Dates
                totalPages,
                count
            };
        },
        // Cache Key: Unique per Mentor + Page + Limit
        [`reviews-${id}-${page}-${limit}`], 
        {
            // Tag: Allows you to revalidateTag(`mentor-reviews-${id}`) when a new review is added
            tags: [`mentor-reviews-${id}`], 
            revalidate: 3600 // Auto-refresh every 1 hour
        }
    );

    const cachedData = await getCachedReviewsData();
    // ============================================================
    // CACHING LOGIC END
    // ============================================================

    // Handle 404 (If cache returned null)
    if (!cachedData) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Mentor not found", ERROR_TYPES.NOT_FOUND);
    }

    const { reviews, totalPages, count } = cachedData;
    // 7. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        { reviews, totalPages, count },
        null,
        ""
    );
};

// Export the GET method, wrapped by the global error handler
export const GET = catchAsync(getReviewsHandler);