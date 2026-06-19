import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is an admin route
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // In middleware, we can't access sessionStorage
    // So we rely on the client-side layout to handle authentication
    // This middleware can be extended to check HTTP-only cookies if you implement them
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
