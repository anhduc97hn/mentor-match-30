// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; 
import { HTTP_STATUS, ERROR_TYPES } from '@/lib/constants';
import { sendResponse } from './lib/utils/helper';

/**
 * Defines the precise path and method combinations that require a valid JWT token.
 * This map is used inside the middleware function to filter requests.
 * * NOTE: The paths must be standardized (e.g., removing trailing slashes, normalizing dynamic parts)
 * The regex uses: ^...$ for exact path match, and (?:\/[^/]+)? for optional dynamic ID segments.
 */
const PROTECTED_ROUTE_PATTERNS = [
    // /userProfiles/me
    { regex: /^\/api\/userProfiles\/me$/, methods: ['GET', 'PUT'] },

    // /certifications and /certifications/:id
    // Matches /api/certifications (POST, GET) and /api/certifications/id (PUT, DELETE)
    { regex: /^\/api\/certifications(?:\/[^/]+)?$/, methods: ['POST', 'GET', 'PUT', 'DELETE'] },

    // /educations and /educations/:id
    { regex: /^\/api\/educations(?:\/[^/]+)?$/, methods: ['POST', 'GET', 'PUT', 'DELETE'] },

    // /experiences and /experiences/:id
    { regex: /^\/api\/experiences(?:\/[^/]+)?$/, methods: ['POST', 'GET', 'PUT', 'DELETE'] },

    // /reviews/:reviewId (GET only)
    { regex: /^\/api\/reviews\/[^/]+$/, methods: ['GET'] },

    // Session APIs (POST, GET, PUT for various session routes)
    // This regex broadly matches /api/sessions, /api/sessions/requests/:id, /api/sessions/:id, /api/sessions/:id/reviews
    { regex: /^\/api\/sessions(?:\/.*)?$/, methods: ['POST', 'GET', 'PUT'] },
];

function shouldBeProtected(pathname: string, method: string): boolean {
    // Explicitly exclude the public Google OAuth redirect route 
    if (pathname === '/api/sessions/google/redirect' && method === 'GET') {
        return false;
    }

    for (const pattern of PROTECTED_ROUTE_PATTERNS) {
        if (pattern.regex.test(pathname) && pattern.methods.includes(method)) {
            return true;
        }
    }
    return false;
}


export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const method = request.method;

    if (!shouldBeProtected(pathname, method)) {
        return NextResponse.next();
    }
    const tokenString = request.headers.get('Authorization');
    try {
      const payload = verifyToken(tokenString || "");
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload._id);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error: any) {
      const status = error.statusCode || HTTP_STATUS.UNAUTHORIZED;
      const message = error.message || "Unauthorized access.";
      const errorType = error.errorType || ERROR_TYPES.UNAUTHORIZED;
      // return NextResponse.json(
      //     {
      //         success: false,
      //         message: message,
      //         errorType: errorType
      //     },
      //     { status: status }
      // );
      return sendResponse(status, false, null, { message: errorType }, message);
    }
}

/**
 * Config object to define all possible API paths that might require authentication.
 * This is a broad path match to minimize the number of routes the middleware checks,
 * but the actual filtering happens in the `shouldBeProtected` function above.
 */
export const config = {
    runtime: 'nodejs',
    matcher: [
        '/api/userProfiles/me',
        '/api/certifications/:path*',
        '/api/educations/:path*',
        '/api/experiences/:path*',
        '/api/reviews/:reviewId',
        // Matcher for all session routes, including nested ones like /requests and /reviews
        '/api/sessions/:path*', 
    ],
};