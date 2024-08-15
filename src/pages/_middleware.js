// import { NextRequest, NextResponse } from 'next/server';

// export default function middleware(req) {


//   const token = req.cookies.token_desacantik;
//   if((req.nextUrl.href.startsWith('/admin')) && (!token)) {
//     return NextResponse.redirect('/pages/login');

//   }

//   if(req.nextUrl.href === '/') {
//     return NextResponse.redirect('/pages/login');
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//       '/',
//   ]}

import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req) {
  const token = req.cookies.token_desacantik;

  console.log('Token:', token);  // Debugging line
  console.log('Request URL:', req.nextUrl.href);  // Debugging line

  if (req.nextUrl.pathname.startsWith('/admin/') && !token) {
    return NextResponse.redirect('/pages/login/');
  }

  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect('/pages/login/');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
  ],
};
