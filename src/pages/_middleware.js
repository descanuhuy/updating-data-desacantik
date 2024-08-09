import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req) {


  const token = req.cookies.token_desacantik;
  if((req.nextUrl.href.startsWith('/admin')) && (!token)) {
    return NextResponse.redirect('/pages/login');

  }

  if(req.nextUrl.href === '/') {
    return NextResponse.redirect('/pages/login');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
      '/',
  ]}