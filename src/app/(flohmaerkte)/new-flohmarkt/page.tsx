import React from "react";
import FlohForm from "@components/@FlohForm/FlohForm";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import AdminRoute from "@app/providers/AdminRoute";
import { iUserMetadata } from "@app/api/auth/types";

export default async function AddFlohmarkt() {
  const session = await getServerUser();
  if (!session?.user) redirect("log-in");
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
            Add a new Flohmarkt
          </h1>
          <FlohForm
            flohFormType="new-flohmarkt"
            FlohForm={{}}
            user={{ email, name, image }}
          />
        </div>
      </main>
    </AdminRoute>
  );
}
