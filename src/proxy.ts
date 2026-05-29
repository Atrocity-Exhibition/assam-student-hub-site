import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that require an authenticated session
const PROTECTED_ROUTES = ["/saved-jobs", "/saved-searches"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Attempt to get the user. If the refresh token is invalid/expired, Supabase
  // throws `refresh_token_not_found`. We catch it here, wipe the stale auth
  // cookies so the browser starts clean, and redirect to /login if the user
  // was trying to access a protected route.
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      // Invalid refresh token — clear auth cookies to prevent a redirect loop
      if (
        error.message?.includes("refresh_token_not_found") ||
        error.message?.includes("Invalid Refresh Token") ||
        (error as { code?: string }).code === "refresh_token_not_found"
      ) {
        response = clearAuthCookiesAndRedirect(request);
        return response;
      }
    } else {
      user = data.user;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.includes("refresh_token_not_found") ||
      msg.includes("Invalid Refresh Token")
    ) {
      response = clearAuthCookiesAndRedirect(request);
      return response;
    }
    // Any other unexpected error — let the request through, don't break the app
  }

  // Guard protected routes
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

/**
 * Clears all Supabase auth cookies from the response and redirects to /.
 * This prevents the stale token from being re-sent on subsequent requests,
 * which would cause the error to repeat on every page load.
 */
function clearAuthCookiesAndRedirect(request: NextRequest): NextResponse {
  const redirectUrl = new URL("/", request.url);
  const response = NextResponse.redirect(redirectUrl);

  // Supabase stores the session in cookies prefixed with `sb-`
  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.startsWith("sb-")) {
      response.cookies.set(cookie.name, "", {
        maxAge: 0,
        path: "/",
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (Next.js static files)
     * - _next/image   (Next.js image optimization)
     * - favicon.ico
     * - public assets
     * - API routes (they handle auth themselves)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
