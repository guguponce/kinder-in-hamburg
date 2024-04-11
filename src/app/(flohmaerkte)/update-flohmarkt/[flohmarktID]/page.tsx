import { getFlohmarktWithID } from "@app/api/dbActions";
import DeleteButton from "@app/components/DeleteButton";
import UpdateButton from "@app/components/UpdateButton";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import FlohForm from "@components/@FlohForm/FlohForm";
import PostNotFound from "@components/@PostForm/PostNotFound";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function UpdateApprovedFlohmarktPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  const session = await getServerSession();

  const flohmarkt = await getFlohmarktWithID(flohmarktID);
  if (!flohmarkt) return <PostNotFound />;
  if (
    !flohmarkt.addedBy.email ||
    !session?.user?.email ||
    ![flohmarkt.addedBy.email, process.env.ADMIN_EMAIL].includes(
      session.user.email
    )
  )
    redirect("/flohmaerkte/" + flohmarktID);

  if (flohmarkt.status === "rejected")
    return (
      <main className="mx-auto flex h-fit w-full max-w-[400px] flex-col items-center justify-center rounded-md bg-hh-100 p-4 gap-4 text-center">
        <h2 className="font-semibold text-xl">
          For some reason the suggested flohmarkt {'"'}
          {flohmarkt.title}
          {'"'} was rejected
        </h2>
        <Link
          className="px-2 py-1 rounded-md font-semibold bg-hh-700 text-white hover:bg-hh-600"
          href="/dashboard"
        >
          Go to your dashboard
        </Link>
      </main>
    );
  return (
    <main className="relative mb-10 mt-6 max-w-[1000px] w-full bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
      <AdminServerComponent>
        <DeleteButton
          deleteFrom={
            flohmarkt.status === "approved" ? "approved" : "suggested"
          }
          id={flohmarkt.id}
          title={flohmarkt.title}
          type="flohmarkt"
          size="large"
        />
      </AdminServerComponent>
      <div className="h-full w-full bg-hh-200 p-5 px-5">
        <h1 className="title-font mb-4 text-center text-xl font-bold text-gray-900 sm:text-3xl">
          UPDATE {flohmarkt.status === "approved" ? "APPROVED" : "SUGGESTED"}{" "}
          FLOHMARKT
        </h1>
        <FlohForm
          flohFormType="update-flohmarkt"
          FlohForm={flohmarkt}
          user={session.user}
        />
      </div>
    </main>
  );
}
