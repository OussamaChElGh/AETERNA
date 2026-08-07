import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Permitir acceso irrestricto en entorno de desarrollo local
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }

    // Check for admin cookie or session
    const isAdmin = request.cookies.get('admin_session')?.value === 'true';
    
    // In production, replace this with proper Firebase Auth verification
    if (!isAdmin) {
      // Bloquear acceso y redirigir al home (o login)
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
