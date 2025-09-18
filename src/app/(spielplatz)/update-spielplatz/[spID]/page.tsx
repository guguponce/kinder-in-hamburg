import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import React from "react";
import SpielplatzForm from "../../SpielplatzForm";
import {
  getAllImagesURLFromSupabaseFolder,
  getSpielplatzWithID,
} from "@app/api/spActions";
import NotFound from "@components/@NotFound/NotFound";
import AdminRoute from "@app/providers/AdminRoute";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Update Spielplatz",
    icons: "/favicon.ico",
  };
}

export default async function NewSpielplatzPage({
  params: { spID },
}: {
  params: { spID: string };
}) {
  const user = await getServerUser();
  if (!user) redirect("/");
  const spielplatz = await getSpielplatzWithID(spID);
  const spImages = await getAllImagesURLFromSupabaseFolder(
    "spielplaetze",
    spID
  );
  if (!spielplatz) return <NotFound type="spielplatz" />;
  if (
    !spielplatz.addedBy.email ||
    !user?.email ||
    ![spielplatz.addedBy.email, process.env.ADMIN_EMAIL].includes(user.email)
  )
    redirect("/");

  const { email, full_name: name, picture: image } = user;
  return (
    <AdminRoute>
      <main className="relative mb-10 mt-6 max-w-[1000px] w-full bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
        <div className="h-full w-full bg-hh-200 p-5 px-5">
          <h1 className="title-font mb-4 text-center text-2xl font-medium text-gray-900 sm:text-3xl">
            Update Spielplatz {spielplatz.title}
          </h1>
          <SpielplatzForm
            spielplatzFormType="update-spielplatz"
            spielplatzForm={spielplatz}
            user={{ email, name, image }}
            spielplatzStoredImages={spImages}
          />
        </div>
      </main>
    </AdminRoute>
  );
}
