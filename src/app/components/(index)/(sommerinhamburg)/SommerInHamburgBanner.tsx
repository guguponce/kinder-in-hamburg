import { getApprovedPostWithCat } from "@app/api/dbActions";
import { getTypeSpielplaetze } from "@app/api/spActions";
import React from "react";
import BadenGallery from "./BadenGallery";
import Link from "next/link";

export default async function SommerInHamburgBanner() {
  const badeplaetze = (await getApprovedPostWithCat("Badeplatz")) || [];
  const freibaeder = badeplaetze.filter(
    (post) => !post.title.toLocaleLowerCase().includes("see")
  );
  const badeseen = badeplaetze.filter((post) =>
    post.title.toLocaleLowerCase().includes("see")
  );
  const wasserspielplaetze =
    (await getTypeSpielplaetze("wasserspielplatz")) || [];
  const wasserspiele = wasserspielplaetze.filter(
    (sp) => sp.spielgeraete && sp.spielgeraete.includes("wasserspiel")
  );
  const planschbecken = (await getTypeSpielplaetze("planschbecken")) || [];

  return (
    <section className="p-4 rounded-lg bg-gradient-to-b from-hh-600 to-hh-500 w-full flex flex-col items-center max-w-[800px] text-white shadow-lg bg-opacity-10 transition-all">
      <Link
        href={"/sommer-in-hamburg"}
        className="text-3xl font-bold p-2 mb-2 sm:mb-none hover:text-hh-50 hover:scale-[1.01] transition-all"
      >
        Sommer in Hamburg
      </Link>
      <BadenGallery
        badeseen={badeseen}
        freibaeder={freibaeder}
        wasserspiele={wasserspiele}
        planschbecken={planschbecken}
      />
    </section>
  );
}
