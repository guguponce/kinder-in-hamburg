import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const GetUserHook = () => {
  const supabase = createClient();
  const [user, setUser] = useState<null | User>();
  useEffect(() => {
    supabase.auth.getUser().then((session) => {
      const {
        data: { user },
        error,
      } = session;
      setUser(user);
      if (error) {
        // console.error("getUser", error, "getUser");
      }
    });
  }, [supabase]);
  return user;
};

export const getClientUser = async () => {
  const supabase = createClient();
  const { data: session, error } = await supabase.auth.getUser();
  if (error) {
    if ("Auth session missing!" === error.message) return { user: null };
    console.error("getClientUser", error, "getClientUser");
  }

  return session;
};
