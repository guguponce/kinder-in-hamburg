import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import dynamic from "next/dynamic";
import AdminRoute from "@app/providers/AdminRoute";

const DynamicForm = dynamic(() => import("../SpielplatzForm"), {
  ssr: false,
});

export default async function NewSpielplatzPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/api/auth/signin");
  return (
    <AdminRoute>
      <main className="relative mb-10 mt-6 max-w-[1000px] w-full bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
        <div className="h-full w-full bg-hh-200 p-5 px-5">
          <h1 className="title-font mb-4 text-center text-2xl font-medium text-gray-900 sm:text-3xl">
            Add a new Flohmarkt
          </h1>
          <DynamicForm
            spielplatzFormType="new-spielplatz"
            spielplatzForm={{}}
            user={{ ...session.user }}
          />
        </div>
      </main>
    </AdminRoute>
  );
}
