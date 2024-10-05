import { iCard } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import SpielplatzgeraeteBackground from "../SpielplatzgeraeteBackground";

export default function ImgPriorityCard({
  size,
  image,
  title,
  link,
  id,
  aspectRatio,
  description,
  spielgeraete,
  bezirk,
  stadtteil,
  children,
}: iCard) {
  const classname =
    size === "small"
      ? {
          container: "min-w-[150px] w-full max-w-[180px]",
          title: "text-md sm:text-md md:text-base",
          description: "hidden",
          bezirk: "text-base ",
        }
      : size === "medium"
      ? {
          container: "min-w-[160px] w-full max-w-[250px]",
          title: "text-md sm:text-lg md:text-xl",
          description: "truncate-2 text-sm md:text-md",
          bezirk: "text-sm md:text-md",
        }
      : {
          container: "min-w-[200px] w-full max-w-[300px]",
          title: "text-md sm:text-base md:text-xl",
          description: "truncate-2  text-sm sm:text-md md:text-lg",
          bezirk: "text-sm sm:text-md md:text-lg",
        };
  return (
    <Link
      href={link || `/posts/${id}`}
      className={`${classname.container} singleCard ${
        aspectRatio ? `aspect-[${aspectRatio}]` : "aspect-[0.66]"
      } w-full rounded-md shadow-md hover:shadow-2xl flex flex-col items-center  bg-hh-50 overflow-hidden`}
      role="link"
      aria-label={`Explore ${title}`}
    >
      <div
        className={`${
          image ? "h-2/3" : "h-1/2"
        } cardImage w-full bg-gradient-to-b from-white to-hh-50`}
      >
        {image ? (
          <img
            loading="lazy"
            className="object-cover w-full rounded-[6px_6px_0_0] h-full flex justify-center items-center"
            src={image}
            alt={title}
          />
        ) : (
          spielgeraete && (
            <SpielplatzgeraeteBackground
              bgColor="#33404D"
              color="#1F262E"
              spList={spielgeraete}
            />
          )
        )}
      </div>
      {children ? (
        children
      ) : (
        <div
          className={` ${
            !image &&
            "p-1 bg-gradient-to-t from-[#e3e8edb9] to-[#ACBAC810] rounded border-hh-100 hover:bg-hh-100 transition-all"
          } cardContent w-full overflow-hidden flex-grow flex flex-col justify-between py-1 px-2  font-sans`}
        >
          <h2
            className={`${classname.title} truncate-3 break-words cardTitle font-bold text-hh-900 w-full`}
          >
            {title}
          </h2>
          {description && (
            <p
              className={`${classname.description} text-hh-700 max-w-full break-words`}
            >
              {description}
            </p>
          )}
          {bezirk && stadtteil && (
            <p
              className={`${classname.bezirk} text-hh-700 font-semibold max-w-full break-words flex flex-col items-start w-full`}
            >
              <span className="block w-fit">{bezirk}</span>
              <span className="block w-fit self-end">{stadtteil}</span>
            </p>
          )}
        </div>
      )}
    </Link>
  );
}
