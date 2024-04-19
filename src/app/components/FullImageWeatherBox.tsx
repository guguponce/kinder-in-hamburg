import Link from "next/link";
import React from "react";

export default function FullImageWeatherBox({
  children,
  title,
  text,
  imgURL,
  prefixLink,
  id,
  weatherAtRight,
}: {
  id: number;
  children: React.ReactNode;
  title: string;
  text?: string;
  imgURL: string;
  prefixLink?: string;
  weatherAtRight?: boolean;
}) {
  return (
    <aside
      className={`bg-sky bg-opacity-20 text-hh-700 flex flex-col gap-4 ${
        weatherAtRight ? "md:flex-row-reverse" : "md:flex-row"
      } items-stretch justify-center rounded w-full h-full bg-cover bg-center bg-no-repeat p-4`}
      style={{ backgroundImage: `url(${imgURL})` }}
    >
      {children}
      <article className="self-end flex flex-col p-4 justify-center w-full md:w- break-words  overflow-hidden text-hh-500 bg-gray-900 bg-opacity-50 rounded hover:bg-opacity-55 hover:shadow-md">
        <h3 className="truncate-2 break-words cardTitle font-bold text-sm sm:text-md md:text-lg text-hh-100  break-word max-w-full">
          {title}
        </h3>
        {text && (
          <h3 className="truncate-4 text-hh-200 italic max-w-full break-words text-xs">
            {text}
          </h3>
        )}
        <Link
          href={`${prefixLink || "/posts/"}${id}`}
          className="self-end px-2 py-1 mt-1 font-semibold capitalize rounded-sm text-white bg-hh-400 hover:bg-hh-500 active:bg-hh-300 break-words w-fit text-center"
        >
          Read more
        </Link>
      </article>
    </aside>
  );
}
