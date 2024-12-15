import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
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
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user } } = await supabase.auth.getUser();

    // Protect all board-related routes
    if (request.nextUrl.pathname.includes('/board') && !user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Protect everything under (protected) route group
    if (request.nextUrl.pathname.startsWith('/(protected)') && !user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Redirect authenticated users from auth pages
    if (user && (
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname === '/sign-in' ||
      request.nextUrl.pathname === '/sign-up'
    )) {
      return NextResponse.redirect(new URL('/board', request.url));
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};

// Update matcher configuration to ensure we catch all relevant routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/board/:path*'  // Explicitly match all board routes
  ]
};