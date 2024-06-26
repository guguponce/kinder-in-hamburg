import { iCard } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import CardLogo from "../@Icons/CardLogo";
import dynamic from "next/dynamic";

const SpielplatzgeraeteBackground = dynamic(
  () => import("../SpielplatzgeraeteBackground"),
  { ssr: false }
);

export default function HorizontalCard({
  id,
  title,
  image,
  description,
  link,
  spielgeraete,
  stadtteil,
}: iCard) {
  return (
    <Link
      href={link || `/posts/${id}`}
      className="w-full min-w-[200px] h-full singleCard rounded-md shadow-md hover:shadow-lg flex items-stretch  bg-hh-50 overflow-hidden"
      role="link"
      aria-label={`Explore ${title}`}
    >
      <div
        className={`cardImage min-h-full flex justify-center items-center w-2/5 bg-hh-800 ${
          spielgeraete && "bg-opacity-5"
        }`}
      >
        {!!image ? (
          <img
            loading="lazy"
            className="object-cover w-full h-full"
            src={image}
            alt={title}
          />
        ) : (
          <>
            {spielgeraete ? (
              <SpielplatzgeraeteBackground
                spList={spielgeraete}
                color="#47596B"
                size="2rem"
              />
            ) : (
              <CardLogo logo="Indoor" color="#ACBAC8" size="3rem" />
            )}
          </>
        )}
      </div>
      <div
        className={`cardContent w-3/5 overflow-hidden flex-grow flex justify-center flex-col p-2 ${
          !stadtteil && "md:p-3 lg:p-4"
        }`}
      >
        {stadtteil && (
          <h4 className="text-hh-700 font-semibold text-sm">{stadtteil}</h4>
        )}
        <h2 className="truncate-2 break-words cardTitle font-bold text-sm sm:text-md md:text-lg text-hh-950  break-word max-w-full text-md sm:text-base">
          {title}
        </h2>
        {description && (
          <p className="text-hh-700 italic max-w-full break-words truncate-4 text-sm">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
