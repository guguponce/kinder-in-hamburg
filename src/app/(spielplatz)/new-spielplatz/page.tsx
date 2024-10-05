import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import React from "react";
import dynamic from "next/dynamic";
import AdminRoute from "@app/providers/AdminRoute";
import { iUserMetadata } from "@app/api/auth/types";

const DynamicForm = dynamic(() => import("../SpielplatzForm"), {
  ssr: false,
});

export default async function NewSpielplatzPage() {
  const session = await getServerUser();
  if (!session?.user) redirect("/");
  const {
    email,
    name,
    avatar_url: image,
  } = session.user.user_metadata as iUserMetadata;
  return (
    <AdminRoute>
      <main className="relative mb-10 mt-6 max-w-[1000px] w-full bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
        <div className="h-full w-full bg-hh-200 p-5 px-5">
          <h1 className="title-font mb-4 text-center text-2xl font-medium text-gray-900 sm:text-3xl">
            Add a new Spielplatz
          </h1>
          <DynamicForm
            spielplatzFormType="new-spielplatz"
            spielplatzForm={{}}
            user={{ email, name, image }}
          />
        </div>
      </main>
    </AdminRoute>
  );
}
