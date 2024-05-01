"use server";
import { Analytics } from "@vercel/analytics/react";
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
        if (
          [
            "https://kinder-in-hamburg.vercel.app/",
            "https://kinder-in-hamburg.de/",
          ].includes(e.url)
        ) {
          if (!kihcookie) {
            return e;
          } else {
            return null;
          }
        }
        return null;
      }}
    />
  );
}
