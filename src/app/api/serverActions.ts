"use server";
import { getServerSession } from "next-auth";

export async function getUserImage() {
  const session = await getServerSession();
  return session?.user?.image;
}
