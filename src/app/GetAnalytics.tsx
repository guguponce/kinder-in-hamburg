"use client"; // Use "use client" to indicate this should run on the client side

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react"; // Import from 'react' for client-side

export default function GetAnalytics() {
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the cookie value client-side
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("kih="));
    const currentHost = window.location.host;
    const currentPath = window.location.pathname;
    if (!cookieValue && currentHost === "www.kinder-in-hamburg.de") {
      setShowAnalytics(true);
      const newCookie = "kih=1; max-age=604800; path=" + currentPath; //7days
      document.cookie = newCookie;
    }
  }, []);

  if (!showAnalytics) {
    return null;
  }
  return (
    <Analytics
      debug={process.env.NODE_ENV === "development"}
      mode={
        process.env.NODE_ENV === "development" ? "development" : "production"
      }
      // beforeSend={(e) => {
      //   if (showAnalytics) {
      //     return e;
      //   } else {
      //     return null;
      //   }
      // }}
    />
  );
}
