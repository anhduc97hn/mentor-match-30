// app/api/userprofiles/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import UserProfile from "@/models/UserProfile"; // Assuming model is available
import Education from "@/models/Education";
import Experience from "@/models/Experience";
import Certification from "@/models/Certification";
import { catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper";
import { HTTP_STATUS } from "@/lib/constants";
import { IEducation } from "@/models/Education";
import { IExperience } from "@/models/Experience";
import { ICertification } from "@/models/Certification";

// --- ZOD QUERY SCHEMA ---
// This schema validates the flat query string parameters and transforms them into
// the structured format the controller logic expects.
const GetUsersQuerySchema = z
  .object({
    // page and limit are optional query strings, preprocessed to ensure they are integers
    page: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).default(1)).optional(),
    limit: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).default(10)).optional(),

    // Filters are optional strings
    searchQuery: z.string().optional(),
    company: z.string().optional(),
    position: z.string().optional(),
    city: z.string().optional(),

    // SortBy defaults to "reviewDesc" if not provided
    sortBy: z.enum(["sessionDesc", "newest", "reviewDesc"]).optional().default("reviewDesc"),
  })
  .transform((data) => {
    // Structure the data to simplify controller access
    return {
      page: data.page ?? 1,
      limit: data.limit ?? 10,
      filter: {
        searchQuery: data.searchQuery,
        company: data.company,
        position: data.position,
        city: data.city,
        sortBy: data.sortBy,
      },
    };
  });

const getUsersHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
  // 1. Validate Query Parameters
  const queryParams = Object.fromEntries(req.nextUrl.searchParams);
  const validatedData = GetUsersQuerySchema.parse(queryParams); // Throws ZodError on bad input

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
