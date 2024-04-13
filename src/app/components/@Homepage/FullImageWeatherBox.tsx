import React from "react";

export default function FullImageWeatherBox({
  children,
  title,
  text,
  imgURL,
}: {
  children: React.ReactNode;
  title: string;
  text?: string;
  imgURL: string;
}) {
  return (
    <aside
      className={`bg-sky bg-opacity-20 text-hh-700 flex flex-col gap-4 md:flex-row items-center justify-center rounded w-full max-w-[1000px] bg-cover bg-center bg-no-repeat min-h-[60vh] p-4`}
      style={{ backgroundImage: `url(${imgURL})` }}
    >
      {children}
      <article className="flex flex-col p-4 justify-center w-full md:w- break-words  overflow-hidden text-hh-500 bg-gray-900 bg-opacity-50 rounded">
        <h2 className="truncate-2 break-words cardTitle font-bold text-sm sm:text-md md:text-lg text-hh-100  break-word max-w-full">
          {title}
        </h2>
        {text && (
          <p className={`text-hh-200 italic max-w-full break-words`}>{text}</p>
        )}
      </article>
    </aside>
  );
}
