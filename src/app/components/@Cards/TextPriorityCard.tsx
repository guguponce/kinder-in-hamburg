import { iCard } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import CardLogo from "../@Icons/CardLogo";
import { cn } from "@app/utils/functions";

export default function TextPriorityCard({
  id,
  title,
  image,
  description,
  link,
  size,
  imgClassname,
  cardContainerClassname,
}: iCard) {
  const classname =
    size === "small"
      ? {
          container: "min-w-[150px] max-w-[160px]",
          description: "truncate-5 text-xs max-h-[5rem]",
          title: "text-sm",
        }
      : size === "medium"
        ? {
            container: "min-w-[160px] max-w-[250px]",
            description: "truncate-5 text-xs overflow-hidden max-h-[80px]",
            title:
              "text-base leading-snug sm:leading-snug md:leading-snug sm:text-lg md:text-xl ",
          }
        : {
            container: "min-w-[200px] max-w-[300px]",
            description: "truncate-7 text-sm",
            title: "text-base  sm:text-base md:text-xl",
          };
  return (
    <Link
      href={link || `/posts/${id}`}
      className={cn(
        "textPriorityCard w-1/2 sm:w-1/3 md:w-1/4 textPriorityCard singleCard aspect-[0.66] rounded-md shadow-md hover:shadow-lg flex flex-col items-center  bg-hh-50 overflow-hidden",
        classname.container,
        cardContainerClassname
      )}
      role="link"
      aria-label={`Explore ${title}`}
    >
      <div className="cardImage relative h-2/5 flex justify-center items-center w-full bg-hh-800">
        {!!image ? (
          <>
            <div
              className="absolute w-full h-full top-0 left-0 blur-sm"
              style={{
                backgroundImage: `url(${image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <img
              loading="lazy"
              className={cn("object-cover w-full h-full", imgClassname)}
              src={image}
              alt={title}
            />
          </>
        ) : (
          <CardLogo />
        )}
      </div>
      <div className="cardContent w-full overflow-hidden flex-grow flex flex-col p-2 min-h-[150px]">
        <h2
          className={`truncate-2 break-words cardTitle font-bold text-hh-950 break-word max-w-full ${classname.title}`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`${classname.description} flex-grow flex flex-col justify-center text-hh-700 italic max-w-full break-words`}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
