import AuthButton from "@components/@Header/AuthButton";
import type { Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Log In",
    icons: "/favicon.ico",
  };
}
export default async function page() {
  return (
    <div>
      <AuthButton />
    </div>
  );
}
