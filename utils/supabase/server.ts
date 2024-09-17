import { createServerClient } from "@supabase/ssr";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { createClient as createClientJS } from "@supabase/supabase-js";

const getCookies = (dynamicCookies?: ReadonlyRequestCookies) => {
  if (dynamicCookies) {
    return dynamicCookies;
  }
  try {
    const cookieStore = cookies();
    return cookieStore;
  } catch (error) {
    return false;
  }
};

export const createClient = (dynamicCookies?: ReadonlyRequestCookies) => {
  const cookieStore = getCookies(dynamicCookies);
  if (!cookieStore) {
    return createClientJS(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.log("Error setting cookies", error);
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};