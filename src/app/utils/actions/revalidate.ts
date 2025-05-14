"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidatePost() {
  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/posts", "layout");
  revalidatePath("/update-post/", "layout");
  revalidatePath("/update-suggestion/", "layout");
  revalidateTag("posts");
}
export async function revalidateSpielplatz() {
  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/spielplaetze", "layout");
  revalidatePath("/update-spielplatz/", "layout");
  revalidatePath("/update-suggested-spielplatz/", "layout");
  revalidateTag("spielplaetze");
}
export async function revalidateFlohmarkt() {
  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/flohmaerkte", "layout");
  revalidatePath("/update-flohmarkt/", "layout");
  revalidatePath("/flohmarkt-approval/", "layout");
  revalidatePath("/update-suggested-flohmarkt/", "layout");
  revalidateTag("flohmaerkte");
}
