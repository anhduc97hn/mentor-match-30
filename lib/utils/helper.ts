import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import dbConnect from "../dbConnect";

// 1. EXTENDED REQUEST TYPE
// We define this interface to include properties like userId, which will be accessed via headers or added by middleware.
export interface ExtendedNextRequest extends NextRequest {
  // userId is accessed via req.headers.get('x-user-id') in the handler, but defined here for type compatibility in HOFs
  userId?: string;
  // Properties for parsed/validated data in middleware (optional)
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

/**
 * Custom error class for operational errors.
 */
export class AppError extends Error {
  public statusCode: number;
  public errorType: string;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, errorType: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.isOperational = true;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

type ResponseData = { [key: string]: any } | null;
type ResponseErrors = { message: string } | null;

/**
 * 2. RESPONSE SENDER (Web Standard API)
 * Generates a standardized NextResponse object.
 */
export const sendResponse = (status: number, success: boolean, data: ResponseData, errors: ResponseErrors, message: string | null): NextResponse => {
  const response: {
    success?: boolean;
    data?: ResponseData;
    errors?: ResponseErrors;
    message?: string;
  } = {};

  if (success) response.success = success;
  if (data) response.data = data;
  if (errors) response.errors = errors;
  if (message) response.message = message;

  // Return a new NextResponse with the JSON body and status code
  return NextResponse.json(response, { status });
};

// 3. ASYNC ERROR WRAPPER (Web Standard API)

type AppRouterContext<P = Record<string, string>> = { params: P };

type RouteHandlerLogic<P = Record<string, string>> = (
  req: ExtendedNextRequest,
  context: AppRouterContext<P> // Context added here
) => Promise<NextResponse>;

export const catchAsync =
  <P = Record<string, string>>(func: RouteHandlerLogic<P>) =>
  async (
    req: ExtendedNextRequest,
    context: AppRouterContext<P> // Context accepted here
  ): Promise<NextResponse> => {
    try {
      await dbConnect();
      
      // Pass both request and context to the wrapped function
      const response = await func(req, context);

      // Ensure a response is returned by the handler
      if (!(response instanceof NextResponse)) {
        // This error check remains valuable
        throw new AppError(HTTP_STATUS.SERVER_ERROR, "Route Handler did not return a NextResponse", ERROR_TYPES.SERVER_ERROR);
      }
      return response;
    } catch (err) {
      console.error("API Error:", err);
      const error = err as AppError;

      // Mimic the original Express global error handler logic:
      const statusCode = error.statusCode && error.isOperational ? error.statusCode : HTTP_STATUS.SERVER_ERROR;

      const errorMessage = error.message;

      // The original logic used errorType in the top-level message field for non-operational errors.
      const responseMessage = error.errorType && error.isOperational ? error.errorType : ERROR_TYPES.SERVER_ERROR;

      // Send the error response using the updated sender
      return sendResponse(statusCode, false, null, { message: errorMessage }, responseMessage);
    }
  };

/**
 * 4. Mongoose ObjectId Validator (Replaced checkObjectId)
 * Throws AppError on failure.
 */
export const checkObjectId = (paramId: string) => {
  const mongoose = require("mongoose");
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid ObjectId", ERROR_TYPES.BAD_REQUEST);
  }
  return true;
};

/**
 * 5. Date Utility
 */
export const getDateFromISO = (dateISOString: string): number => {
  const date = new Date(dateISOString);
  return date.getUTCDate();
};

export const AppErrorUtil = AppError; // Exporting the class directly

// Note: Using explicit ES exports instead of module.exports
