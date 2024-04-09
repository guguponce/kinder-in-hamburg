import React from "react";
import FlohForm from "@components/@FlohForm/FlohForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getApprovedFlohmaerkte, getFlohmarktWithID } from "@app/api/dbActions";
import Link from "next/link";
import PostNotFound from "@app/components/@PostForm/PostNotFound";

export default async function UpdateSuggestedFlohmarkt({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  const session = await getServerSession();
  if (!session?.user) redirect("/api/auth/signin");
  const flohmarkt = await getFlohmarktWithID(flohmarktID);
  if (!flohmarkt) return <PostNotFound />;
  if (
    !session.user.email ||
    ![process.env.ADMIN_EMAIL, flohmarkt.addedBy.email].includes(
      session.user.email
    )
  )
    redirect("/");

  if (flohmarkt.status === "approved")
    return (
      <main className="mx-auto flex h-fit w-full max-w-[400px] flex-col items-center justify-center rounded-md bg-hh-100 p-4 gap-4 text-center">
        <h2 className="font-semibold text-xl">
          Your suggestion: {'"'}
          {flohmarkt.title}
          {'"'} <br /> has already been approved
        </h2>
        <p>That means that you can not change it anymore</p>
        <Link
          className="px-2 py-1 rounded-md font-semibold bg-hh-700 text-white hover:bg-hh-600"
          href={`/flohmaerkte/${flohmarktID}`}
        >
          Check it out
        </Link>
      </main>
    );
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
    <main className="body-font relative mb-10 mt-6 max-w-[1000px] w-full bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
      <div className="h-full w-full bg-hh-200 p-5 px-5">
        <h1 className="title-font mb-4 text-center text-xl font-bold text-gray-900 sm:text-3xl">
          UPDATE SUGGESTED FLOHMARKT
        </h1>
        <FlohForm
          flohFormType="update-suggestion"
          FlohForm={flohmarkt}
          user={session.user}
        />
      </div>
    </main>
  );
}
