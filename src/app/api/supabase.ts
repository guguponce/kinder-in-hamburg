"use server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_ANON_KEY ?? ""
);

export const supabase = async (file: File) => {
  const data = await supabaseAdmin.storage
    .from("spielplatz")
    .upload("public/avatar1.png", file, {
      upsert: false,
    });

  return data;
};
