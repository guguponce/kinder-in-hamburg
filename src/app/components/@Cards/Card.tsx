import { iCard } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import CardLogo from "../@Icons/CardLogo";

export default function TextPriorityCard({
  id,
  title,
  image,
  description,
  categories = "Indoor",
  link,
  size,
}: iCard) {
  const classname =
    size === "small"
      ? {
          container: "min-w-[150px] max-w-[180px]",
          description: "truncate-3  text-xs",
          title: "text-sm sm:text-md md:text-base",
        }
      : size === "medium"
      ? {
          container: "min-w-[160px] max-w-[250px]",
          description: "truncate-5  text-xs",
          title: "text-md sm:text-lg md:text-xl",
        }
      : {
          container: "min-w-[200px] max-w-[300px]",
          description: "truncate-5  text-sm",
          title: "text-md sm:text-base md:text-xl",
        };
  return (
    <Link
      href={link || `/posts/${id}`}
      className={`${classname.container} w-1/2 sm:w-1/3 md:w-1/4 singleCard aspect-[0.66] rounded-md shadow-md hover:shadow-lg flex flex-col items-center  bg-hh-50 overflow-hidden`}
      role="link"
      aria-label={`Explore ${title}`}
    >
      <div className="cardImage h-2/5 flex justify-center items-center w-full bg-hh-800">
        {!!image ? (
          <img
            loading="lazy"
            className="object-cover w-full h-full"
            src={image}
            alt={title}
          />
        ) : (
          <CardLogo logo="Indoor" color="#ACBAC8" size="3rem" />
        )}
      </div>
      <div className="cardContent w-full overflow-hidden flex-grow flex flex-col p-2">
        <h2 className="truncate-2 break-words cardTitle font-bold text-sm sm:text-md md:text-lg text-hh-950  break-word max-w-full">
          {title}
        </h2>
        {description && (
          <p
            className={`${classname.description} text-hh-700 italic max-w-full break-words`}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
