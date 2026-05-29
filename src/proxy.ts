import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_ROUTES = ["/saved-jobs", "/saved-searches"];

export async function proxy(request: NextRequest) {
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

  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
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
  }

  const { pathname } = request.nextUrl;

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin");

  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!ADMIN_EMAIL || user.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

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

function clearAuthCookiesAndRedirect(request: NextRequest): NextResponse {
  const redirectUrl = new URL("/", request.url);
  const response = NextResponse.redirect(redirectUrl);

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
