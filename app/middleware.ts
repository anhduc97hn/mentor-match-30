// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the paths that MUST have an authenticated user.
// Uses a simpler pattern check.
const protectedRoutes = [
  '/account', 
  '/mentors/[mentorId]/session' // Note: This matches the /mentors/[...]/session structure
];

export function middleware(request: NextRequest) {
  // CRITICAL: Read the access token from the cookie
  // This assumes your backend sets the accessToken in a cookie.
  const sessionToken = request.cookies.get('accessToken')?.value;
  const currentPath = request.nextUrl.pathname;
  
  // Check if the current path is one of the protected routes
  const isProtectedRoute = protectedRoutes.some(route => {
    // Basic check for paths starting with /account
    if (route.startsWith('/account') && currentPath.startsWith('/account')) {
      return true;
    }
    // Check for specific dynamic segments, e.g., /mentors/123/session
    if (route.includes('[mentorId]/session') && currentPath.includes('/session')) {
        // A more robust check might be needed here, but this is a good start
        return currentPath.includes('/mentors/') && currentPath.endsWith('/session');
    }
    return false;
  });

  if (isProtectedRoute && !sessionToken) {
    // User is trying to access a protected route without a token
    // Redirect them instantly to the login page
    const loginUrl = new URL('/auth/login', request.url);
    // Optional: Add a 'from' query parameter to redirect back after login
    loginUrl.searchParams.set('from', currentPath);
    return NextResponse.redirect(loginUrl);
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// 🚨 IMPORTANT: Define the routes the middleware should check
// This tells Next.js which paths should run the middleware logic.
export const config = {
  matcher: [
    // Include all paths in (main) group and the auth pages (for redirection logic)
    '/account/:path*', 
    '/mentors/:path*/session',
    '/auth/:path*' 
  ],
};