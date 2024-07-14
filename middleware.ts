import { NextResponse } from 'next/server';
import { parseCookies } from 'nookies';

export function middleware(req) {
    const accessToken = req.cookies.get('accessToken');
  
  if (req.nextUrl.pathname === '/home' && !accessToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/dashboard/:path*'], // Add other protected routes here
};
