import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Check for admin cookie or session
    const isAdmin = request.cookies.get('admin_session')?.value === 'true';
    
    // For now, allow access without auth (you can add Firebase Auth check later)
    // In production, replace this with proper Firebase Auth verification
    
    if (!isAdmin) {
      // Optional: redirect to login or show unauthorized
      // return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
