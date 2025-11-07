/**
 * @route PUT /auth/forgotpassword
 * @description forget password 
 * @access Public
 */

// app/api/auth/forgotpassword/route.ts
import { NextResponse } from "next/server";
import User from "@/models/User"; 
import nodemailer from "nodemailer";
// Utilities for error handling, response, and constants
import { AppError, catchAsync, sendResponse, ExtendedNextRequest } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";
// Zod schema for input validation
import { ForgotPasswordSchema } from "@/lib/validation/schemas"; 

// Environment variables used for nodemailer
const EMAIL = process.env.EMAIL as string;
const PASSWORD = process.env.PASSWORD as string; 
const CLIENT_URL = process.env.CLIENT_URL as string;

// Define the handler logic, wrapped by catchAsync
const forgotPasswordHandler = async (req: ExtendedNextRequest): Promise<NextResponse> => {
    
    // 1. Validate Input (Zod)
    const body = await req.json().catch(() => ({}));
    // Throws ZodError on failure, caught by catchAsync
    const validatedBody = ForgotPasswordSchema.parse(body); 

    const { email } = validatedBody; 

    // 2. Find User (Original auth.controller.js logic)
    const user = await User.findOne({ email });

    if (!user) {
        // Return 404 if user not found
        throw new AppError(
            HTTP_STATUS.NOT_FOUND,
            "User with that email does not exist",
            ERROR_TYPES.NOT_FOUND
        );
    }

    // 3. Generate Reset Token
    // Note: Assuming User model conversion included the IUserMethods for generateResetToken
    const resetToken = await user.generateResetToken();

    // 4. Setup Nodemailer Transport (Original auth.controller.js logic)
    const config = {
        service : 'gmail',
        auth : {
            user: EMAIL,
            pass: PASSWORD
        }
    };
    const transporter = nodemailer.createTransport(config);

    // 5. Setup Email Data
    const emailData = {
        from: EMAIL,
        to: email,
        subject: `Password Reset link`,
        text: `Password Reset Link: ${CLIENT_URL}/resetpassword/${resetToken}`,
        html: `
            <h1>Please use the following link to reset your password</h1>
            <p>${CLIENT_URL}/resetpassword/${resetToken}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>${CLIENT_URL}</p>
        `
    };

    // 6. Send Email and Handle Failure
    try {
        await transporter.sendMail(emailData);
    } catch (err) {
        // Log and throw the mail server error to be caught by catchAsync
        console.error("Transporter Error:", err);
        throw new AppError(
            HTTP_STATUS.SERVER_ERROR, 
            "Mail server is not working", 
            ERROR_TYPES.SERVER_ERROR
        );
    }
    
    // 7. Return Success Response
    return sendResponse(
        HTTP_STATUS.OK,
        true,
        { resetToken },
        null,
        `Email has been sent to ${email}. Follow the instruction to activate your account`
    );
};

// Export the PUT method, wrapped by the global error handler
export const PUT = catchAsync(forgotPasswordHandler);