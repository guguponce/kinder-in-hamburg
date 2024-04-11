import { getApprovedFlohmaerkte } from "@app/api/dbActions";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import FlohmarktPoster from "@components/@PostForm/FlohmarktPoster";
import Link from "next/link";
import React from "react";

export default async function FlohmarktPage() {
  const flohmaerkte = await getApprovedFlohmaerkte();
  if (!flohmaerkte) return <PostNotFound multiples={true} type="flohmarkt" />;
  if (flohmaerkte.length === 0)
    return (
      <main className="flex flex-col items-center justify-center p-6 rounded-md bg-hh-100 w-[500px] max-w-full m-2 gap-4">
        <h2 className="text-lg font-bold text-hh-950">
          There are no flea markets available
        </h2>
        <Link
          className="p-2 rounded-md bg-hh-800 hover:bg-hh-700 active:bg-hh-600 text-white"
          href={"/"}
        >
          Home
        </Link>
      </main>
    );
  return (
    <main className="rounded bg-hh-100 bg-opacity-25 w-full max-w-[1000px] p-4 flex flex-col items-center min-h-[50vh] gap-2">
      <h1 className="text-4xl font-bold my-2 p-2 rounded bg-opacity-50 bg-hh-50">
        Flea Markets
      </h1>
      <section className="flex flex-wrap items-stretch rounded bg-hh-100 bg-opacity-25 w-full p-4">
        {flohmaerkte.map(({ title, image, date, bezirk, id }) => (
          <article
            className="sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-[300px] md:max-w-[400px] aspect-[0.75] relative"
            key={id}
          >
            <FlohmarktPoster
              title={title}
              image={image}
              date={date}
              bezirk={bezirk}
              prefixLink="/flohmaerkte/"
              id={id}
            />
          </article>
        ))}
      </section>
    </main>
  );
}
