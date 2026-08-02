import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is UX convenience only — it stops an unauthenticated/wrong-role user
// from seeing a page flash before redirecting. The REAL security check still
// happens on the backend (every /admin/* endpoint verifies role from the JWT
// itself). Never rely on this file alone to protect admin data.
export function middleware(request: NextRequest) {
  const token = request.cookies.get('verifinews_token')?.value;
  const role = request.cookies.get('verifinews_role')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/auth');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');

  // Not logged in, trying to reach a protected route → send to sign-in
  if (!token && (isDashboardRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // Logged in, trying to reach login/signup again → send to their home
  if (token && isAuthRoute) {
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/admin/default' : '/dashboard', request.url),
    );
  }

  // Regular user trying to reach admin pages → send back to their dashboard
  if (token && isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
};
