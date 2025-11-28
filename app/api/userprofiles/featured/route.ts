// app/api/userprofiles/featured/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import UserProfile from "@/models/UserProfile";
import { catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper"; 
import { HTTP_STATUS } from "@/lib/constants";
import { PaginationQuerySchema } from "@/lib/validation/schemas"; 
import Education from "@/models/Education";
import Experience from "@/models/Experience";
import Certification from "@/models/Certification";

const getFeaturedUsersHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
    
    // 1. Validate Query Parameters (page, limit)
    const queryParams = Object.fromEntries(req.nextUrl.searchParams);
    const { page, limit } = PaginationQuerySchema.parse(queryParams); // Throws ZodError on bad input

    // 2. Filtering Logic 
    const filterConditions: any[] = [{ isMentor: true }];
    const filterCrireria = filterConditions.length
        ? { $and: filterConditions }
        : {};

    // 3. Pagination Setup 
    const count = await UserProfile.countDocuments(filterCrireria);
    // Note: totalPages is not explicitly used or returned in the original featured endpoint, but calculated here for completeness.
    // const totalPages = Math.ceil(count / limit); 
    const offset = limit * (page - 1);

    // 4. Database Query (Filter, Sort, Populate)
    const userProfiles = await UserProfile.find(filterCrireria)
        .populate("education", null, Education)
        .populate("experiences", null, Experience)
        .populate("certifications", null, Certification)
        // Sorts by sessionCount descending for featured mentors
        .sort({ sessionCount: -1 }) 
        .skip(offset)
        .limit(limit);

    // 5. Return Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        { userProfiles, count }, // Original controller returned { userProfiles, count }
        null,
        ""
    );
};

// Export the GET method, wrapped by the global error handler
export const GET = catchAsync(getFeaturedUsersHandler);