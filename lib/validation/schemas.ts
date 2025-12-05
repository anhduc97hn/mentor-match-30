// lib/validation/schemas.ts
import { z } from "zod";

// Utility to define the pattern for MongoDB ObjectIds (24 hex characters)
const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

// --- User/Auth Schemas ---

// POST /users/signup
export const SignUpSchema = z.object({
  name: z.string().min(1, "Invalid name"),
  email: z.email("Invalid email"), // Replaces isEmail and normalizeEmail validation
  password: z.string().min(1, "Invalid password"),
  isMentor: z.boolean().optional(),
});

// POST /auth/login
export const LoginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Invalid password"),
});

// PUT /auth/forgotpassword
export const ForgotPasswordSchema = z.object({
  email: z.email("Invalid email"),
});

// PUT /auth/resetpassword
export const ResetPasswordSchema = z.object({
  newPassword: z.string().min(1, "Invalid new password"),
  resetToken: z.string().min(1, "Invalid reset link"),
});

// --- Profile Background Schemas ---

// POST /certifications
export const CreateCertiSchema = z.object({
  name: z.string().min(1, "Invalid name"),
  description: z.string().min(1, "Invalid description"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// POST /educations
export const CreateEduSchema = z.object({
  degree: z.string().min(1, "Invalid degree"),
  end_year: z.string().min(1, "Invalid end year"),
  field: z.string().min(1, "Invalid field"),
  description: z.string().min(1, "Invalid description"),
  url: z.url("Invalid URL").optional().or(z.literal("")),
});

// POST /experiences
// This replaces the check for body("position").exists().notEmpty()
export const CreateExpSchema = z.object({
  company: z.string().min(1, "Invalid company"),
  industry: z.string().min(1, "Invalid industry"),
  location: z.string().min(1, "Invalid location"),
  url: z.url("Invalid URL").optional().or(z.literal("")),
  position: z.object({
    title: z.string().min(1, "Position title required"),
    description: z.string().optional(),
    start_date: z.string().min(1, "Start date required"),
    end_date: z.string().optional(),
  }),
});

// --- Session/Review Schemas ---

// POST /sessions/requests/:userProfileId
export const SendSessionRequestSchema = z.object({
  topic: z.string().min(1, "missing topic"),
  problem: z.string().min(1, "missing problem"),
  startDateTime: z.iso.date("missing or invalid startDateTime"),
  endDateTime: z.iso.date("missing or invalid endDateTime"),
});

// POST /sessions/:sessionId/reviews
export const CreateReviewSchema = z.object({
  content: z.string().min(1, "Missing content"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
});

// PUT /sessions/:sessionId
export const UpdateSessionStatusSchema = z.object({
  status: z.enum(["pending", "accepted", "declined", "completed", "cancelled", "reviewed"], {
    error: "Invalid or missing status",
  }),
});

// --- Parameter Schema (For path/query validation) ---

export const ObjectIdParamSchema = z.object({
  id: ObjectIdSchema.or(z.string().min(1, "Invalid or missing ID in parameters")), // Matches checkObjectId logic
});

export const PaginationQuerySchema = z.object({
  page: z
    .preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).default(1))
    .optional()
    .default(1),
  limit: z
    .preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).default(10))
    .optional()
    .default(10),
});

export const UpdateUserProfileSchema = z
  .object({
    // These fields correspond to the original 'allows' array in userProfile.controller.js
    name: z.string().optional(),
    avatarUrl: z.url("Invalid URL format for avatarUrl").optional(),
    aboutMe: z.string().optional(),
    city: z.string().optional(),
    facebookLink: z.url("Invalid URL format for Facebook").optional(),
    instagramLink: z.url("Invalid URL format for Instagram").optional(),
    linkedinLink: z.url("Invalid URL format for LinkedIn").optional(),
    twitterLink: z.url("Invalid URL format for Twitter").optional(),
    currentCompany: z.string().optional(),
    currentPosition: z.string().optional(),
  })
  .partial(); // .partial() makes all fields optional, matching the controller's logic

// Extended Schema: Use .extend() to create the GetSessionsQuerySchema
export const GetSessionsQuerySchema = PaginationQuerySchema.extend({
  // Add the required 'status' field
  status: z.enum(["pending", "accepted", "declined", "completed", "cancelled", "reviewed"], {
    error: "Invalid or missing status",
  }),
});

export const GetUsersQuerySchema = z
  .preprocess(
    (data: any) => {
      // 1. Convert to a standard object if not already
      const processed = { ...data };

      // 2. Define the keys that might be wrapped in filter[...]
      const filterKeys = ["searchQuery", "company", "position", "city", "sortBy"];

      filterKeys.forEach((key) => {
        const bracketKey = `filter[${key}]`;

        // If the bracketed key exists, map it to the clean key
        if (processed[bracketKey]) {
          processed[key] = processed[bracketKey];
        }

        // Cleanup: Treat empty strings as undefined so .optional() works correctly
        if (processed[key] === "") {
          processed[key] = undefined;
        }
      });

      return processed;
    },
    z.object({
      // page and limit are optional query strings, preprocessed to ensure they are integers
      page: z.preprocess((val) => (val ? parseInt(val as string, 10) : 1), z.number().int().min(1).default(1)),
      limit: z.preprocess((val) => (val ? parseInt(val as string, 10) : 10), z.number().int().min(1).default(10)),
      searchQuery: z.string().optional(),
      company: z.string().optional(),
      position: z.string().optional(),
      city: z.string().optional(),
      sortBy: z.enum(["sessionDesc", "newest", "reviewDesc"]).optional(),
    })
  )
  .transform((data) => {
    return {
      page: data.page,
      limit: data.limit,
      filter: {
        searchQuery: data.searchQuery,
        company: data.company,
        position: data.position,
        city: data.city,
        sortBy: data.sortBy,
      },
    };
  });