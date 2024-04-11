import React from "react";
import FlohForm from "@components/@FlohForm/FlohForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AddFlohmarkt() {
  const session = await getServerSession();
  if (!session?.user) redirect("/api/auth/signin");
  return (
    <main className="relative mb-10 mt-6 max-w-[1000px] w-full bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
      <div className="h-full w-full bg-hh-200 p-5 px-5">
        <h1 className="title-font mb-4 text-center text-2xl font-medium text-gray-900 sm:text-3xl">
          Add a new Flohmarkt
        </h1>
        <FlohForm
          flohFormType="new-flohmarkt"
          FlohForm={{}}
          user={{ ...session.user }}
        />
      </div>
    </main>
  );
}
