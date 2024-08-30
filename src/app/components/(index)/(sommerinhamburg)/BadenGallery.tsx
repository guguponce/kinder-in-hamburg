"use client";
import ShuffleGallery from "@app/components/ShuffleGallery";
import { iPost, iSpielplatz } from "@app/utils/types";
import Link from "next/link";
import React from "react";

interface BadenGalleryProps {
  badeseen: iPost[];
  freibaeder: iPost[];
  wasserspiele: iSpielplatz[];
  planschbecken: iSpielplatz[];
}

export default function BadenGallery({
  badeseen,
  freibaeder,
  wasserspiele,
  planschbecken,
}: BadenGalleryProps) {
  const [whichList, setWhichList] =
    React.useState<keyof BadenGalleryProps>("badeseen");
  const list: BadenGalleryProps = {
    badeseen,
    freibaeder,
    wasserspiele,
    planschbecken,
  };
  return (
    <div className="w-full flex items-center h-fit sm:items-stretch justify-around flex-col sm:flex-row gap-4 bg-hh-100 bg-opacity-50 p-2 rounded">
      <div className="flex flex-col items-center gap-2 flex-1">
        <p className="italic px-2 sm:py-6">
          Der Sommer ist fast vorbei, aber wir haben noch ein paar Tipps für den
          letzten warmen Wochen!
        </p>
        <div className="w-full sm:w-auto flex flex-1 justify-center items-center">
          <div className="w-full flex flex-wrap sm:gap-4 sm:max-w-[350px] justify-between sm:justify-center items-center px-2 sm:p-4">
            {["badeseen", "freibaeder", "wasserspiele", "planschbecken"].map(
              (type) => (
                <button
                  className={`${
                    whichList === type
                      ? "bg-opacity-100 text-white"
                      : "bg-opacity-20 text-hh-100 "
                  } p-1 sm:p-2 rounded shadow-md font-semibold bg-hh-500 capitalize hover:shadow-lg hover:scale-[1.01] text-xs sm:text-base`}
                  onClick={() => setWhichList(type as keyof BadenGalleryProps)}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>
        <Link
          href="/sommer-in-hamburg"
          className="underline underline-offset-2 font-semibold px-2 py-6 text-end text-hh-800 self-end sm:block hidden hover:scale-[1.01] transition-all hover:underline-offset-4"
        >
          Mehr entdecken
        </Link>
      </div>
      <section className="flex w-[250px] aspect-[3/4]">
        <ShuffleGallery list={list[whichList]} shuffle={true} titleUnder dark />
      </section>
      <Link
        href="/sommer-in-hamburg"
        className="underline underline-offset-2 font-semibold px-2 py-2 sm:py-6 text-end text-hh-800 self-end block sm:hidden"
      >
        Mehr entdecken
      </Link>
    </div>
  );
}
