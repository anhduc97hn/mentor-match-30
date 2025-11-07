/**
 * @route PUT /auth/resetpassword
 * @description reset password  
 * @access resetToken access
 */

// app/api/auth/resetpassword/route.ts
import { NextResponse } from "next/server";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/User"; 
import { AppError, catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
import { ResetPasswordSchema } from "@/lib/validation/schemas"; 
import { z } from "zod";

// Ensure environment variable is available
const JWT_RESET_PASSWORD = process.env.JWT_RESET_PASSWORD as string;

// Define the handler logic, wrapped by catchAsync
const resetPasswordHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
    
    // 1. Validate Input (Zod)
    const body = await req.json().catch(() => ({}));
    // Throws ZodError on failure, caught by catchAsync
    const validatedBody = ResetPasswordSchema.parse(body); 

    const { resetToken, newPassword } = validatedBody; 

    let userId: string = '';

    // 2. Verify Reset Token (Original auth.controller.js logic)
    //
    try {
        const payload = jwt.verify(resetToken, JWT_RESET_PASSWORD) as { _id: string, email: string };
        userId = payload._id;
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            throw new AppError(
                HTTP_STATUS.UNAUTHORIZED,
                "Expired link. Try again",
                ERROR_TYPES.UNAUTHORIZED
            );
        } else {
            throw new AppError(
                HTTP_STATUS.UNAUTHORIZED,
                "Link is invalid",
                ERROR_TYPES.UNAUTHORIZED
            );
        }
    }

    // 3. Hash New Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // 4. Update User Password
    const user = await User.findByIdAndUpdate(
        userId, 
        { password: passwordHash }, 
        { new: true, select: "-password" } // Select "-password" to return the updated user object without the hash
    );

    // This case should ideally not happen if token verification succeeded, but is a safety check
    if (!user) {
         throw new AppError(
            HTTP_STATUS.NOT_FOUND, 
            "User not found for this token", 
            ERROR_TYPES.NOT_FOUND
        );
    }

    // 5. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        user,
        null,
        "Great! Now you can login with your new password"
    );
};

// Export the PUT method, wrapped by the global error handler
export const PUT = catchAsync(resetPasswordHandler);