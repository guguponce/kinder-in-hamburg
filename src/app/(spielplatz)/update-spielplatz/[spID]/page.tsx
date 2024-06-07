import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import SpielplatzForm from "../../SpielplatzForm";
import {
  getAllSpielplatzImagesURL,
  getSpielplatzWithID,
} from "@app/api/spActions";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import AdminRoute from "@app/providers/AdminRoute";
export default async function NewSpielplatzPage({
  params: { spID },
}: {
  params: { spID: string };
}) {
  const session = await getServerSession();
  if (!session?.user) redirect("/api/auth/signin");
  const spielplatz = await getSpielplatzWithID(spID);
  const spImages = await getAllSpielplatzImagesURL(spID);
  if (!spielplatz) return <PostNotFound type="spielplatz" />;
  if (
    !spielplatz.addedBy.email ||
    !session?.user?.email ||
    ![spielplatz.addedBy.email, process.env.ADMIN_EMAIL].includes(
      session.user.email
    )
  )
    redirect("/flohmaerkte/" + spID);

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
            user={{ ...session.user }}
            spielplatzStoredImages={spImages}
          />
        </div>
      </main>
    </AdminRoute>
  );
}
