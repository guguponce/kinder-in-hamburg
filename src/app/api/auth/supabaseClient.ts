import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const getClientSession = async () => {
  const supabase = createClient();
  const { data: session, error } = await supabase.auth.getSession();
  if (error) console.log("getClientSession", error, "getClientSession");
  return session;
};

export const getClientUser = async () => {
  const supabase = createClient();
  const { data: session, error } = await supabase.auth.getUser();
  if (error) console.log("getClientUser", error, "getClientUser");

  return session;
};