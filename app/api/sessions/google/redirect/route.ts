// app/api/sessions/google/redirect/route.ts
import { NextResponse, NextRequest } from "next/server";
import { google } from "googleapis";
import Session from "@/models/Session"; 
import UserProfile from "@/models/UserProfile";
import User, { IUser } from "@/models/User";
import { AppError, catchAsync } from "@/lib/utils/helper"; 
import { HTTP_STATUS, ERROR_TYPES } from "@/lib/constants";

// --- Environment Variables and Google OAuth Setup ---
//
const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URL = process.env.REDIRECT_URL as string; 

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

// Define the handler logic, wrapped by catchAsync
// Note: This public route only takes the request object; context is not used for params here.
const createGoogleEventRedirectHandler = async (req: NextRequest): Promise<NextResponse> => {
    
    const url = req.nextUrl;
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // Session ID is passed as state

    if (!code || !state) {
        throw new AppError(HTTP_STATUS.BAD_REQUEST, "Missing code or state in redirect", ERROR_TYPES.BAD_REQUEST);
    }
    
    // 1. Exchange Code for Tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Set credentials for the client instance for this request
    oauth2Client.setCredentials(tokens);
 
    // 2. Find Session and User Profiles
    const session = await Session.findById(state);
    
    if (!session) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Session not found", ERROR_TYPES.NOT_FOUND);
    }
    
    // Populate User and UserProfile data needed for event creation
    const fromUserProfile = await UserProfile.findById(session.from).populate<{ userId: IUser }>("userId");
    const toUserProfile = await UserProfile.findById(session.to).populate<{ userId: IUser}>("userId");
    
    if (!fromUserProfile || !toUserProfile || !fromUserProfile.userId || !toUserProfile.userId) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Required user profiles or user data missing", ERROR_TYPES.NOT_FOUND);
    }

    const toEmail = toUserProfile.userId.email;
    const fromEmail = fromUserProfile.userId.email;

    // 3. Define Google Calendar Event Input
    const gEvent = {
        summary: session.topic,
        description: session.problem,
        start: {
            dateTime: session.startDateTime.toISOString(),
        },
        end: {
            dateTime: session.endDateTime.toISOString(),
        },
        attendees: [{ email: fromEmail }, { email: toEmail }],
        reminders: {
            useDefault: false,
            overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
            ],
        },
    };

    const calendar = google.calendar({ version: "v3" });

    // 4. Insert Event into Google Calendar
    const { data: createdEvent } = await calendar.events.insert({
        calendarId: "primary",
        auth: oauth2Client,
        requestBody: gEvent,
    });

    // 5. Redirect the user to the Google Calendar event URL
    const redirectUrl = createdEvent.htmlLink as string;
    
    // Use NextResponse.redirect for a standard Web API redirect response
    return NextResponse.redirect(redirectUrl);
};

// Export the GET method, wrapped by the global error handler
export const GET = catchAsync(createGoogleEventRedirectHandler);