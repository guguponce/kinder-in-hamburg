import React from "react";
export default function Home() {
  return (
    <main id="homepage-main" className="w-full flex flex-col items-center">
      <h1 id="kinder-in-hamburg" className="font-semibold text-white">
        Kinder in Hamburg
      </h1>
      <section className="flex flex-wrap justify-end items-start  min-h-[50dvh] my-8 shadow-md md:shadow-none">
        <img
          id="img-display"
          alt="Planetarium"
          className="object-contain max-h-[70vh] max-w-full m-0 self-center"
          loading="lazy"
          src={"/assets/blogPosts/planetarium.jpg"}
        />
      </section>
    </main>
  );
}
