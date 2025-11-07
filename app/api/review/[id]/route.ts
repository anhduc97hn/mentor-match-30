// app/api/reviews/[reviewId]/route.ts
import { NextResponse } from "next/server";
import Review from "@/models/Review"; // Assuming model is imported
import { AppError, catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import { ObjectIdParamSchema } from "@/lib/validation/schemas"; 
import { z } from "zod";

// Define the handler logic, wrapped by catchAsync
// P is the generic type for the context.params object
const getSingleReviewHandler = async (
    req: ExtendedNextRequest,
    context: RouteContext<'/reviews/[id]'> 
): Promise<NextResponse> => {
    
    // 1. Authentication Check (Injected by Middleware)
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        // This is primarily caught by middleware, but serves as a final safety check
        throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Login required", ERROR_TYPES.UNAUTHORIZED);
    }

    // 2. Validate Dynamic Parameter (reviewId)
    // Throws ZodError/AppError on validation failure (invalid ObjectId format)
    const validatedParams = ObjectIdParamSchema.parse(context.params);
    const { id } = validatedParams;

    // 3. Business Logic (Original review.controller.js logic)
    //
    const review = await Review.findById(id)
        .populate("session");

    // 4. Handle 404 Not Found
    if (!review) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Review not found", ERROR_TYPES.NOT_FOUND);
    }

    // 5. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        review,
        null,
        null
    );
};

// Export the GET method, wrapped by the global error handler
export const GET = catchAsync(getSingleReviewHandler);