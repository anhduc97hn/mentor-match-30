// app/api/userprofiles/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import UserProfile from "@/models/UserProfile";
import Education from "@/models/Education";
import Experience from "@/models/Experience";
import Certification from "@/models/Certification";
import { catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper";
import { HTTP_STATUS } from "@/lib/constants";
import { GetUsersQuerySchema } from "@/lib/validation/schemas";

const getUsersHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
  // 1. Validate Query Parameters
  const queryParams = Object.fromEntries(req.nextUrl.searchParams);
  const validatedData = GetUsersQuerySchema.parse(queryParams);
  let { page, limit, filter } = validatedData;

  // 2. Filtering Logic (Based on original controller)
  const filterConditions: any[] = [{ isMentor: true }];

  if (filter.searchQuery) {
    filterConditions.push({
      name: { $regex: filter.searchQuery, $options: "i" },
    });
  }
  if (filter.company) {
    filterConditions.push({
      currentCompany: { $regex: filter.company, $options: "i" },
    });
  }
  if (filter.position) {
    filterConditions.push({
      currentPosition: { $regex: filter.position, $options: "i" },
    });
  }
  if (filter.city) {
    filterConditions.push({
      city: { $regex: filter.city, $options: "i" },
    });
  }

  const filterCrireria = filterConditions.length ? { $and: filterConditions } : {};

  // 3. Pagination Setup and Counting
  const count = await UserProfile.countDocuments(filterCrireria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  // 4. Sorting Logic
  const sortOptions: any = {};
  switch (filter.sortBy) {
    case "sessionDesc":
      sortOptions.sessionCount = -1;
      break;
    case "newest":
      sortOptions.createdAt = -1;
      break;
    case "reviewDesc":
    default:
      sortOptions.reviewAverageRating = -1;
      break;
  }

  // 5. Database Query and Population
  const userProfiles = await UserProfile.find(filterCrireria)
  .populate("education", null, Education)
  .populate("experiences", null, Experience)
  .populate("certifications", null, Certification)
  .sort(sortOptions).skip(offset).limit(limit);

  // 6. Return Response
  return sendResponse(HTTP_STATUS.OK, true, { userProfiles, totalPages, count }, null, "");
};

// Export the GET method, wrapped by the global error handler
export const GET = catchAsync(getUsersHandler);
