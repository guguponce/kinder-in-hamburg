import { getFlohmarktWithID } from "@app/api/dbActions";
import FlohForm from "@app/components/@FlohForm/FlohForm";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function UpdateApprovedFlohmarktPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  const session = await getServerSession();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL)
    redirect("/flohmaerkte/" + flohmarktID);

  const flohmarkt = await getFlohmarktWithID(flohmarktID);
  if (!flohmarkt) return <PostNotFound />;
  if (flohmarkt.status !== "approved")
    redirect(`//update-suggested-flohmarkt//${flohmarktID}`);

  return (
    <main className="body-font relative mb-10 mt-6 max-w-[1000px] w-full bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
      <div className="h-full w-full bg-hh-200 p-5 px-5">
        <h1 className="title-font mb-4 text-center text-xl font-bold text-gray-900 sm:text-3xl">
          UPDATE APPROVED FLOHMARKT
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
