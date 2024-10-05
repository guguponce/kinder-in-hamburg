import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    const currentPath = request.nextUrl.pathname;
    let response =
      currentPath === currentPath.toLowerCase()
        ? NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
        : NextResponse.redirect(
            new URL(request.nextUrl.origin + currentPath.toLowerCase()),
            { headers: request.headers }
          );
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );

            response =
              currentPath === currentPath.toLowerCase()
                ? NextResponse.next({
                    request,
                  })
                : NextResponse.redirect(
                    new URL(request.nextUrl.origin + currentPath.toLowerCase()),
                    request
                  );
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const user = await supabase.auth.getUser();

    // protected routes
    if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  } catch (e) {
    const currentPath = request.nextUrl.pathname;
    return currentPath === currentPath.toLowerCase()
      ? NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
      : NextResponse.redirect(
          new URL(request.nextUrl.origin + currentPath.toLowerCase()),
          { headers: request.headers }
        );
  }
};
