(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__, module, exports) => {

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { signToken, verifyToken } from '@/lib/auth/session';
// const protectedRoutes = '/dashboard';
// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const sessionCookie = request.cookies.get('session');
//   const isProtectedRoute = pathname.startsWith(protectedRoutes);
//   if (isProtectedRoute && !sessionCookie) {
//     return NextResponse.redirect(new URL('/sign-in', request.url));
//   }
//   let res = NextResponse.next();
//   if (sessionCookie && request.method === 'GET') {
//     try {
//       const parsed = await verifyToken(sessionCookie.value);
//       const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
//       res.cookies.set({
//         name: 'session',
//         value: await signToken({
//           ...parsed,
//           expires: expiresInOneDay.toISOString()
//         }),
//         httpOnly: true,
//         secure: true,
//         sameSite: 'lax',
//         expires: expiresInOneDay
//       });
//     } catch (error) {
//       console.error('Error updating session:', error);
//       res.cookies.delete('session');
//       if (isProtectedRoute) {
//         return NextResponse.redirect(new URL('/sign-in', request.url));
//       }
//     }
//   }
//   return res;
// }
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
//   runtime: 'nodejs'
// };
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map