import { iCard } from "@app/utils/types";
import Link from "next/link";
import React from "react";

export default function ImageCard({
  id,
  title,
  image,
  link,
  size = "medium",
}: iCard) {
  const classname =
    size === "small"
      ? {
          container: "min-w-[150px] max-w-[180px]",
        }
      : size === "medium"
      ? {
          container: "min-w-[160px] max-w-[250px]",
        }
      : {
          container: "min-w-[200px] max-w-[300px]",
        };
  return (
    <Link
      href={link || `/posts/${id}`}
      className={`${classname.container} singleCard relative aspect-[0.66]  w-1/3 rounded-md shadow-md hover:shadow-2xl flex flex-col items-center  bg-hh-50 overflow-hidden`}
      role="link"
      aria-label={`Explore ${title}`}
    >
      <div className="cardImage h-full w-full">
        <img className="object-cover w-full h-full" src={image} alt={title} />
      </div>
      <div className="absolute bottom-0 cardContent w-full bg-gradient-to-t from-black via-[#1111118f] to-transparent overflow-hidden flex-grow flex flex-col p-2">
        <h2 className="truncate-2 break-words cardTitle font-bold text-sm sm:text-md md:text-lg text-hh-100  w-full">
          {title}
        </h2>
      </div>
    </Link>
  );
}
