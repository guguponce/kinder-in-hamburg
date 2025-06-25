import { iCard } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import SpielplatzgeraeteBackground from "./SpielplatzgeraeteBackground";
import { cn } from "@app/utils/functions";

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
  cardContainerClassname,
}: iCard) {
  const classname =
    size === "small"
      ? {
          container: "min-w-[150px] w-full max-w-[160px] sm:max-w-[180px]",
          title: "text-sm sm:text-base",
          description: "hidden",
          bezirk: "text-base ",
        }
      : size === "medium"
        ? {
            container: "min-w-[160px] w-full max-w-[250px]",
            title: "text-base sm:text-lg md:text-xl",
            description: "truncate-2 text-sm italic",
            bezirk: "text-sm md:text-base text-hh-900",
          }
        : {
            container: "min-w-[200px] w-full max-w-[300px]",
            title: "text-base sm:text-base md:text-xl",
            description: "truncate-2  text-sm sm:text-base italic",
            bezirk: "text-sm sm:text-base md:text-lg text-hh-900",
          };
  return (
    <Link
      href={link || `/posts/${id}`}
      className={cn(
        `singleCard ${
          aspectRatio ? `aspect-[${aspectRatio}]` : "aspect-[0.66]"
        } w-full rounded-md shadow-md hover:shadow-2xl flex flex-col items-center  bg-hh-50 overflow-hidden`,
        classname.container,
        cardContainerClassname
      )}
      role="link"
      title={title}
      aria-label={`Explore ${title}`}
    >
      <div
        className={`${
          children ? "flex-grow" : image ? "h-2/3" : "h-1/2"
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
              color="#343b3e"
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
          } cardContent w-full overflow-hidden flex-grow flex flex-col justify-between py-1 px-2 font-sans min-h-fit`}
        >
          <h2
            className={`${classname.title} truncate-3 break-words cardTitle font-bold text-hh-900 w-full sm:leading-5 align-middle`}
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
          {bezirk ||
            (stadtteil && (
              <p
                className={`${classname.bezirk} text-hh-700 font-semibold max-w-full break-words flex flex-col items-start w-full`}
              >
                {bezirk && <span className="block w-fit">{bezirk}</span>}
                {stadtteil && (
                  <span className="block w-fit self-end">{stadtteil}</span>
                )}
              </p>
            ))}
        </div>
      )}
    </Link>
  );
}
