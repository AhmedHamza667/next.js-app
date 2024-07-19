import { NextResponse } from 'next/server';
import { parseCookies } from 'nookies';

export function middleware(req) {
    const accessToken = req.cookies.get('accessToken');
  
  if (req.nextUrl.pathname === '/jobs' && !accessToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (req.nextUrl.pathname === '/users' && !accessToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/jobs', '/users'], // Add other protected routes here
};
