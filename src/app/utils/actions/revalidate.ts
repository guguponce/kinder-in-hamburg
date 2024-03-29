"use server";

import { revalidatePath } from "next/cache";
import { sleep } from "../functions";
import { redirect } from "next/navigation";

export async function revalidate() {
  revalidatePath("/");
  revalidatePath("/posts", "layout");
  revalidatePath("/update/", "layout");
}

export async function revalidateAndRoute(id: string) {
  console.log("revalidating");
  revalidate().then(() => {
    sleep(2000).then(() => {
      redirect(`/posts/${id}`);
    });
  });
}
