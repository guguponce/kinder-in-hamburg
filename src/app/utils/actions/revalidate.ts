"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePost() {
  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/posts", "layout");
  revalidatePath("/update-post/", "layout");
  revalidatePath("/update-suggestion/", "layout");
}
export async function revalidateFlohmarkt() {
  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/flohmaerkte", "layout");
  revalidatePath("/update-flohmarkt/", "layout");
  revalidatePath("/flohmarkt-approval/", "layout");
  revalidatePath("/update-suggested-flohmarkt/", "layout");
}
