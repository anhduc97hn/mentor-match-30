// app/api/sessions/requests/[userProfileId]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import Session from "@/models/Session";
import UserProfile from "@/models/UserProfile";
import { AppError, catchAsync, sendResponse, ExtendedNextRequest, AppRouterContext } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import { chainMiddleware, customerAccessRequired, validate } from "@/lib/utils/api-middleware";
import { SendSessionRequestSchema, ObjectIdParamSchema } from "@/lib/validation/schemas"; 

const sendSessionRequestHandler = async (
    req: ExtendedNextRequest,
    context: AppRouterContext<{id: string}>
): Promise<NextResponse> => {
    
    // 1. Inputs are guaranteed by the chain:
    const { id } = await context.params; // Param validated in catchAsync wrapper
    const validatedBody = req.validatedBody; // Body validated by middleware

    const { topic, problem, startDateTime, endDateTime } = validatedBody;
    
    // 2. Find Recipient Profile (Mentor)
    const toUserProfile = await UserProfile.findById(id);
    if (!toUserProfile) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Mentor not found", ERROR_TYPES.NOT_FOUND);
    }

    // 3. Find Sender Profile (Customer)
    // userId is guaranteed to exist by the loginRequired middleware (implicitly run before customerAccessRequired)
    const userId = req.headers.get('x-user-id'); 
    const fromUserProfile = await UserProfile.findOne({ userId: userId });

    // 4. Create Session
    const session = await Session.create({
        from: fromUserProfile?._id, // Sender's profile ID
        to: id,           // Recipient's profile ID
        status: "pending",
        topic: topic,
        problem: problem,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
    });

    // 5. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        session,
        null,
        "Request has been sent"
    );
};

// --- Middleware Chain Setup ---
const postMiddlewares = [
    // 1. Authorization: Only customers can send session requests
    customerAccessRequired,
    
    // 2. Validation: Body (topic, problem, dates)
    validate({ 
        body: SendSessionRequestSchema 
    }),
];

// Export the POST method, wrapped in the middleware chain and global error handler
export const POST = catchAsync(async (req, context) => {
    // 1. Parameter Validation (Must run first for dynamic routes)
    ObjectIdParamSchema.parse(context.params);
    
    // 2. Execute Middleware Chain and Final Handler
    return chainMiddleware(postMiddlewares, sendSessionRequestHandler)(req, context);
});