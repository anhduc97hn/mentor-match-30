import { ERROR_TYPES, HTTP_STATUS } from "@/lib/constants"
import { chainMiddleware, mentorAccessRequired } from "@/lib/utils/api-middleware"
import { AppError, AppRouterContext, catchAsync, ExtendedNextRequest, sendResponse } from "@/lib/utils/helper"
import { ObjectIdParamSchema } from "@/lib/validation/schemas"
import Certification from "@/models/Certification"
import UserProfile from "@/models/UserProfile"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import z from "zod"

const deleteCertiHandler = async (req: ExtendedNextRequest,  context: AppRouterContext<{id: string}>): Promise<NextResponse> => {
  // 1. userId is guaranteed to exist by the authentication middleware
  const userId = req.headers.get('x-user-id')

  // 2. Find Current User's Profile ID
  const currentUserProfile = await UserProfile.findOne({ userId: userId })
  if (!currentUserProfile) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User profile not found", ERROR_TYPES.NOT_FOUND)
  }

  // 3. Get validated certification ID
 const params = await context.params;
    const validatedParams = ObjectIdParamSchema.parse(params);
    const { id } = validatedParams;
  // 4. Find the certification and ensure it belongs to the current user
  const certification = await Certification.findOne({
    _id: id,
    userProfile: currentUserProfile._id,
    isDeleted: false,
  })
  if (!certification) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Certification not found", ERROR_TYPES.NOT_FOUND)
  }

  // 5. Soft delete
  certification.isDeleted = true
  await certification.save()

  revalidateTag(`mentor-profile-${currentUserProfile._id.toString()}`)
  revalidateTag('mentors')

  // 6. Return Success Response
  return sendResponse(
    HTTP_STATUS.OK,
    true,
    { certification },
    null,
    'Certification deleted successfully',
  )
}

const deleteMiddlewares = [
    // 1. Authorization: Requires user to be a mentor
    mentorAccessRequired
];

// Export the DELETE method, wrapped in the middleware chain and global error handler
export const DELETE = catchAsync(async (req, context) => {
    return chainMiddleware(deleteMiddlewares, deleteCertiHandler)(req, context);
});