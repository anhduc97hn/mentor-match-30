// app/api/certifications/route.ts
import { NextResponse } from "next/server";
import Certification from "@/models/Certification";
import UserProfile from "@/models/UserProfile";
import { AppError, catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper";
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import { chainMiddleware, mentorAccessRequired, validate } from "@/lib/utils/api-middleware";
import { PaginationQuerySchema, CreateCertiSchema, ObjectIdParamSchema } from "@/lib/validation/schemas";
import { z } from "zod";
import { revalidateTag } from "next/cache";

// Define the core handler logic
const getCertiHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {

    // 1. Inputs are guaranteed by the chain:
    // Query validated by validate middleware, stored in req.validatedQuery
    const { page, limit } = req.validatedQuery as z.infer<typeof PaginationQuerySchema>;

    const userId = req.headers.get('x-user-id');

    // 2. Find Current User's Profile ID
    const currentUserProfile = await UserProfile.findOne({ userId: userId });

    // 3. Filtering Criteria (Based on original controller logic)
    // Filters by isDeleted: false AND userProfile: currentUserProfile._id
    const filterConditions: any[] = [
        { isDeleted: false },
        { userProfile: currentUserProfile._id }
    ];

    const filterCrireria = filterConditions.length
        ? { $and: filterConditions }
        : {};

    // 4. Pagination Setup
    const count = await Certification.countDocuments(filterCrireria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    // 5. Fetch Certifications
    const certifications = await Certification.find(filterCrireria)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

    // 6. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        { certifications, totalPages, count },
        null,
        ""
    );
};

const createCertiHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
  // 1. userId is guaranteed to exist by the authentication middleware
  const userId = req.headers.get('x-user-id')

  // 2. Find Current User's Profile ID
  const currentUserProfile = await UserProfile.findOne({ userId: userId })

  // 3. Get validated data
  const certData = req.validatedBody as z.infer<typeof CreateCertiSchema>

  // 4. Create new Certification mapped to the user profile
  const newCertification = await Certification.create({
    ...certData,
    userProfile: currentUserProfile._id,
  })

  currentUserProfile.certifications.push(newCertification._id)
  await currentUserProfile.save()

  revalidateTag(`mentor-profile-${currentUserProfile._id.toString()}`)
  revalidateTag('mentors')
  // 5. Return Success Response
  return sendResponse(
    HTTP_STATUS.OK,
    true,
    { certification: newCertification },
    null,
    'Certification created successfully',
  )
}



// --- Middleware Chain Setup ---
const getMiddlewares = [
    // 1. Authorization: Requires user to be a mentor
    mentorAccessRequired,

    // 2. Validation: Query parameters (page, limit)
    validate({
        query: PaginationQuerySchema
    }),
];

const postMiddlewares = [
    // 1. Authorization: Requires user to be a mentor
    mentorAccessRequired,

    // 2. Validation: Request body for certification creation
    validate({
        body: CreateCertiSchema
    }),
];

// Export the GET method, wrapped in the middleware chain and global error handler
export const GET = catchAsync(async (req, context) => {
    // The query validation is executed before the handler runs
    return chainMiddleware(getMiddlewares, getCertiHandler)(req, context);
});

// Export the POST method, wrapped in the middleware chain and global error handler
export const POST = catchAsync(async (req, context) => {
    // The body validation is executed before the handler runs
    return chainMiddleware(postMiddlewares, createCertiHandler)(req, context);
});


