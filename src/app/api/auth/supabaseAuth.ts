"use server";
import { headers } from "next/headers";
import { createClient } from "@auth/server";
import { redirect } from "next/navigation";
import { iUserMetadata } from "./types";

export const signIn = async () => {
  const supabase = createClient();
  const origin = headers().get("origin");
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) console.error("signIn", error, "signIn");
  return redirect(`${data.url}`);
};

export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) console.error("signOut", error, "signOut");
  return redirect("/");
};

export const getServerSession = async () => {
  const supabase = createClient();
  const { data: user, error } = await supabase.auth.getSession();
  if (error) console.error("getServerSession", error, "getServerSession");
  return user.session;
};

export const getServerUser = async () => {
  const supabase = createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error) {
    if ("Auth session missing!" === error.message) return null;
    const session = await getServerSession();
  }
  const { user } = userData;
  if (!user) return null;
  return user.user_metadata as iUserMetadata;
};
