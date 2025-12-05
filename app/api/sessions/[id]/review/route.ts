// app/api/sessions/[sessionId]/reviews/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import Session from "@/models/Session";
import Review from "@/models/Review";
import UserProfile from "@/models/UserProfile";
import { AppError, catchAsync, sendResponse, ExtendedNextRequest, AppRouterContext } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import { chainMiddleware, customerAccessRequired, validate } from "@/lib/utils/api-middleware";
import { ObjectIdParamSchema, CreateReviewSchema } from "@/lib/validation/schemas"; 
import { revalidateTag } from "next/cache";

// --- Helper Functions (Adapted from review.controller.js) ---

// Count the number of reviewed sessions for a mentor
const calculateReviewCount = async (userProfileId: string) => {
    // Finds all sessions where userProfileId is the recipient and status is 'reviewed'
    const sessions = await Session.find({ to: userProfileId, status: "reviewed" });

    // Count reviews associated with those sessions
    const reviewCount = await Review.countDocuments({
        session: { $in: sessions.map((session) => session._id) },
    });

    // Save to DB
    await UserProfile.findByIdAndUpdate(userProfileId, {
        reviewCount: reviewCount,
    });
};

// Calculate the average rating for a mentor
const calculateAverageRating = async (userProfileId: string) => {
    const sessions = await Session.find({ to: userProfileId, status: "reviewed" });
    const reviews = await Review.find({
        session: { $in: sessions.map((session) => session._id) },
    });

    let reviewAverageRating = 0;
    if (reviews.length > 0) {
        const ratings = reviews.map((review) => review.rating);
        reviewAverageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
    }
    
    // Save to DB 
    await UserProfile.findByIdAndUpdate(userProfileId, {
        reviewAverageRating: reviewAverageRating,
    });
};

type SessionReviewParams = { 
  id: string 
};
const createNewReviewHandler = async (
    req: ExtendedNextRequest,
    context: AppRouterContext<SessionReviewParams>
): Promise<NextResponse> => {
    
    // 1. Inputs are guaranteed by chainMiddleware:
    const validatedParams = await context.params;
    const validatedBody = req.validatedBody;

    const { id } = validatedParams;
    const { content, rating } = validatedBody;

    // 2. Update Session Status (and retrieve original session data)
    const session = await Session.findByIdAndUpdate(id, { status: "reviewed" });
    
    if (!session) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Session not found", ERROR_TYPES.NOT_FOUND);
    }
    
    // 3. Create Review
    const review = await Review.create({
        session: id,
        content,
        rating,
    });

    // The mentor's UserProfile ID
    const mentorProfileId = session.to.toString();

    // 4. Recalculate Metrics
    await calculateReviewCount(mentorProfileId);
    await calculateAverageRating(mentorProfileId);

    revalidateTag(`mentor-reviews-${mentorProfileId}`)

    // 5. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        review,
        null,
        "Create new review successful"
    );
};

// --- Middleware Chain Setup ---
const postMiddlewares = [
    // 1. Authorization: Only customers can review
    customerAccessRequired,
    
    // 2. Validation: Param (sessionId) and Body (content, rating)
    validate({ 
        // Note: Param validation happens in the main handler function via Zod parsing context.params
        body: CreateReviewSchema 
    }),
];

// Export the POST method, wrapped in the middleware chain and global error handler
export const POST = catchAsync(async (req, context) => {
    // 1. Parameter Validation (Must run first for dynamic routes)
    ObjectIdParamSchema.parse(context.params);
    
    // 2. Execute Middleware Chain and Final Handler
    return chainMiddleware(postMiddlewares, createNewReviewHandler)(req, context);
});