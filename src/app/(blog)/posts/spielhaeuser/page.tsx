import { getPostsWithCat } from "@app/api/dbActions";
import AdminRoute from "@app/providers/AdminRoute";
import dynamic from "next/dynamic";
import React from "react";

const SpielhaeuserMap = dynamic(() => import("./SpielhaeuserMap"), {
  ssr: false,
});

export default async function SpielhaeuserPage() {
  const sphList = await getPostsWithCat(["Spielhaus"]);
  if (!sphList) throw Error("No Spielhaus retrieved");
  return (
    <AdminRoute>
      <main className="w-full text-hh-50 mx-auto flex flex-col gap-4 items-center">
        <section id="hero" className="max-w-[800px] w-4/5">
          <h1 className="p-8 text-center font-bold text-4xl">Spielhäuser</h1>
          <p className="xl:text-lg italic">
            Spielhäuser sind Gemeinschaftszentren für Kinder und ihre Familien,
            die eine sichere und kreative Umgebung bieten. Sie ermöglichen
            Aktivitäten wie Basteln, Sport und Bildungsworkshops. Kinder können
            spielen, lernen und ihre sozialen Fähigkeiten entwickeln, während
            Eltern sich beteiligen oder Unterstützung erhalten. Diese Zentren
            organisieren auch besondere Veranstaltungen wie Jahreszeitenfeste,
            Ausflüge und kulturelle Austauschprogramme, die das
            Gemeinschaftsgefühl und die Inklusion fördern.
          </p>
        </section>
        <SpielhaeuserMap sphList={sphList} />
      </main>
    </AdminRoute>
  );
}
