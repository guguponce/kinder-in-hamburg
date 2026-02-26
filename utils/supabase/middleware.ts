import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  const { pathname, origin } = request.nextUrl;

  // 1️⃣ Normalize URL to lowercase
  if (pathname !== pathname.toLowerCase()) {
    return NextResponse.redirect(new URL(origin + pathname.toLowerCase()));
  }

  // 2️⃣ Base response
  const response = NextResponse.next({ request });

  // 3️⃣ Supabase server client with manual cookie adapter (needed in middleware)
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (
          cookiesToSet: { name: string; value: string; options?: any }[],
        ) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Update request cookies (so session works immediately)
            request.cookies.set(name, value);

            // Persist cookies in the browser
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // 4️⃣ Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 5️⃣ Protect routes
  if (pathname.startsWith("/protected") && !user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
};
// export const updateSession = async (request: NextRequest) => {
//   try {
//     const currentPath = request.nextUrl.pathname;
//     let response =
//       currentPath === currentPath.toLowerCase()
//         ? NextResponse.next({
//             request: {
//               headers: request.headers,
//             },
//           })
//         : NextResponse.redirect(
//             new URL(request.nextUrl.origin + currentPath.toLowerCase()),
//             { headers: request.headers }
//           );
//     const supabase = createServerClient(
//       process.env.SUPABASE_URL!,
//       process.env.SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           getAll() {
//             return request.cookies.getAll();
//           },
//           setAll(
//             cookiesToSet: { name: string; value: string; options?: any }[]
//           ) {
//             cookiesToSet.forEach(({ name, value }) =>
//               request.cookies.set(name, value)
//             );

//             response =
//               currentPath === currentPath.toLowerCase()
//                 ? NextResponse.next({
//                     request,
//                   })
//                 : NextResponse.redirect(
//   new URL(request.nextUrl.origin + currentPath.toLowerCase())
// );
//             cookiesToSet.forEach(({ name, value, options }) =>
//               response.cookies.set(name, value, options)
//             );
//           },
//         },
//       }
//     );

//     const user = await supabase.auth.getUser();

//     // protected routes
//     if (request.nextUrl.pathname.startsWith("/protected") && !user.data.user) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     return response;
//   } catch (e) {
//     const currentPath = request.nextUrl.pathname;
//     return currentPath === currentPath.toLowerCase()
//       ? NextResponse.next({
//           request: {
//             headers: request.headers,
//           },
//         })
//       : NextResponse.redirect(
//           new URL(request.nextUrl.origin + currentPath.toLowerCase()),
//           { headers: request.headers }
//         );
//   }
// };
