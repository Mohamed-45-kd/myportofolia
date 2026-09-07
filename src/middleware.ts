import { NextResponse, type NextRequest } from "next/server";

/**
 * Fast redirect for unauthenticated admin traffic.
 *
 * Middleware runs on the edge runtime, which has no access to Node's crypto
 * primitives, so this only checks that a session cookie is *present and
 * well-formed*. It is a routing convenience, not the security boundary.
 *
 * The real check is `requireAdmin()`, which verifies the cookie's HMAC
 * signature and expiry. It runs in the admin layout (guarding every page) and
 * again inside every admin server action, because server actions are
 * independently reachable HTTP endpoints that middleware does not cover.
 */

const SESSION_COOKIE = "mwj_admin_session";
const TOKEN_SHAPE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const looksSignedIn = Boolean(token && TOKEN_SHAPE.test(token));

  // Someone already signed in has no reason to see the sign-in screen.
  if (pathname === "/admin/login") {
    if (looksSignedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!looksSignedIn) {
    const url = new URL("/admin/login", request.url);
    // Send them back where they were headed once signed in.
    if (pathname !== "/admin") url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
