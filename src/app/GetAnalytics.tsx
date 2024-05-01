"use server";
import { Analytics } from "@vercel/analytics/next";
import { cookies } from "next/headers";

export default async function AnalyticsComponent() {
  const kihcookie = cookies().get("kih")?.value;
  // if (kihcookie) return null;
  return (
    <Analytics
      debug={process.env.NODE_ENV === "development"}
      mode={
        process.env.NODE_ENV === "development" ? "development" : "production"
      }
      beforeSend={(e) => {
        "use server";
        if (!kihcookie) {
          return e;
        } else {
          return null;
        }
      }}
    />
  );
}
