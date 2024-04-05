import { iCard } from "@app/utils/types";
import Link from "next/link";
import React from "react";

export default function ImgPriorityCard({
  size,
  image,
  title,
  link,
  id,
  aspectRatio,
  description,
}: iCard) {
  const classname =
    size === "small"
      ? {
          container: "min-w-[150px] max-w-[180px]",
          title: "text-sm sm:text-md md:text-base",
          description: "hidden",
        }
      : size === "medium"
      ? {
          container: "min-w-[160px] max-w-[250px]",
          title: "text-md sm:text-lg md:text-xl",
          description: "truncate-2  text-xs",
        }
      : {
          container: "min-w-[200px] max-w-[300px]",
          title: "text-md sm:text-base md:text-xl",
          description: "truncate-2  text-sm",
        };
  return (
    <Link
      href={link || `/posts/${id}`}
      className={`${classname.container} singleCard ${
        aspectRatio ? `aspect-[${aspectRatio}]` : "aspect-[0.66]"
      }  w-full rounded-md shadow-md hover:shadow-2xl flex flex-col items-center  bg-hh-50 overflow-hidden`}
      role="link"
      aria-label={`Explore ${title}`}
    >
      <div className="cardImage h-2/3 w-full">
        <img className="object-cover w-full h-full" src={image} alt={title} />
      </div>
      <div className="cardContent w-full overflow-hidden flex-grow flex flex-col p-2">
        <h2
          className={`${classname.title} truncate-2 break-words cardTitle font-bold text-hh-950 w-full`}
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
      </div>
    </Link>
  );
}
