import { iPost } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import DisplayTypeText from "./@PostForm/DisplayTypeText";
import PostLogo from "./@Icons/@PostLogo/PostLogo";
import ImagesModalGallery from "./ImagesModalGallery";
import RecommendationsMap from "@app/components/@Map/RecommendationsMap";

const BackButton = ({ type }: { type: "spielhaus" | "general" }) => (
  <>
    {type === "spielhaus" ? (
      <Link
        href={"/spielhaeuser"}
        className="text-sm text-hh-700 px-2 py-1 hover:underline hover:underline-offset-4 min-w-fit transition-all rounded-md"
      >
        ← Alle Spielhäuser
      </Link>
    ) : (
      <Link
        href={"/posts"}
        className="text-sm text-hh-700 px-2 py-1 hover:underline hover:underline-offset-4 min-w-fit transition-all rounded-md "
      >
        ← All Posts
      </Link>
    )}
  </>
);

export default function PostTemplate({
  post: {
    title,
    image,
    text,
    createdAt,
    lastUpdate,
    bezirk,
    stadtteil,
    address,
    pinnedPost,
    minAge,
    maxAge,
    link,
    igAccounts,
    id,
    categories,
  },
  children,
}: {
  post: iPost;
  children?: React.ReactNode;
}) {
  return (
    <main
      id="post-template-main"
      className="w-full max-w-[1200px] bg-hh-100 rounded-lg p-6 relative"
    >
      {children}
      <div
        id="back-buttons"
        className="relative flex justify-between gap-4 w-full flex-col sm:flex-row"
      >
        <BackButton
          type={
            title.toLocaleLowerCase().includes("spielhaus")
              ? "spielhaus"
              : "general"
          }
        />
        <div className="flex gap-1 items-center">
          <section
            id="categories"
            className={`flex justify-end gap-1 h-fit flex-wrap w-full ${
              pinnedPost && "sm:pr-12"
            }`}
          >
            {categories.map((cat) => (
              <h3
                className="px-2 py-1 h-fit w-fit text-end leading-tight rounded-md align-middle font-semibold bg-transparent transition-all text-hh-700 hover:text-white hover:bg-hh-700"
                key={cat}
                // href={`/categories/${encodeURIComponent(cat)}`}
              >
                {cat}
              </h3>
            ))}
          </section>
        </div>
        {pinnedPost && (
          <div className="absolute flex self-start w-12 min-w-12 h-full border-0 m-0 -top-6 sm:-top-6 right-0">
            <img
              src="/assets/icons/bookmark.svg"
              alt="Pinned Post"
              className="w-full h-12"
            />
          </div>
        )}
      </div>

      <article
        id="text"
        className="w-full lg:self-start p-4 rounded-md bg-hh-50 flex flex-col gap-4"
      >
        <h1 className="text-4xl text-center font-bold">{title}</h1>
        {!!image?.length && (
          <div id="posts-images" className="flex items-center gap-2">
            <div className="flex justify-center items-center w-full overflow-hidden">
              <ImagesModalGallery images={image} title={title} />
            </div>
          </div>
        )}
        <article className="flex flex-col break-words w-fit self-center max-w-full">
          {text.map(([type, text], i) => (
            <React.Fragment key={text + i}>
              <DisplayTypeText type={type} text={text} />
            </React.Fragment>
          ))}
        </article>

        <p className="italic text-xs text-hh-500 text-end self-end">
          {lastUpdate && lastUpdate !== createdAt
            ? `(Letztes Update: ${new Date(lastUpdate).toLocaleDateString()})`
            : `(${new Date(createdAt).toLocaleDateString()})`}
        </p>
      </article>
      <section
        id="details"
        className={`w-full mx-auto max-w-[800px] flex flex-wrap flex-col sm:flex-row gap-2 ${
          (!!bezirk || !!address) && (!!link || !!igAccounts?.length)
            ? "justify-center sm:justify-between"
            : "justify-center"
        }`}
      >
        <RecommendationsMap
          id={id}
          bezirk={bezirk}
          stadtteil={stadtteil}
          currentType="post"
        />
        {(!!bezirk || !!address) && (
          <div className="flex w-full flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 sm:gap-1">
            <section
              id="location"
              className="w-full xl:flex-grow bg-hh-200 bg-opacity-25 rounded p-4"
            >
              <h2 className="text-lg font-semibold">Location</h2>
              {bezirk && (
                <div className="flex gap-1 items-center">
                  <PostLogo logo="hamburg" color="#1F262E" />

                  <Link
                    href={`/bezirke/${encodeURIComponent(bezirk)}`}
                    id="bezirk"
                    className="block font-semibold italic hover:underline hover:underline-offset-2"
                  >
                    {bezirk}
                  </Link>
                </div>
              )}
              {!!stadtteil && (
                <div className="ml-6 flex gap-1 items-center">
                  {/* <PostLogo logo="stadtteil" color="#1F262E" /> */}
                  <p id="stadtteil" className="ml-1 block font-semibold italic">
                    {stadtteil}
                  </p>
                </div>
              )}
              {!!address && (
                <div className="flex gap-[6px] items-center ml-[2px]">
                  <PostLogo logo="map" color="#1F262E" size="20px" />
                  <Link
                    href={
                      "https://www.google.com/maps/place/" +
                      address.street +
                      "+" +
                      address.number +
                      "+" +
                      address.PLZ +
                      "+" +
                      address.city
                    }
                    className="italic hover:underline hover:underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {address.street} {address.number}, {address.PLZ}{" "}
                    {address.city}
                  </Link>
                </div>
              )}
            </section>

            {((minAge && minAge > 0) || !!maxAge) && (
              <section
                id="age"
                className="w-full lg:min-w-fit xl:w-fit bg-hh-200 bg-opacity-25 rounded p-4"
              >
                <h2 className="text-lg font-semibold">Alter Empfehlung</h2>
                <p>
                  {maxAge
                    ? `${minAge} - ${maxAge} Jahren`
                    : `${minAge}+ Jahren`}
                </p>
              </section>
            )}
          </div>
        )}
        {(!!link || !!igAccounts?.length) && (
          <section
            id="links-box"
            className="w-full px-4 bg-hh-200 bg-opacity-25 rounded p-4"
          >
            <h2 className="text-lg font-semibold">Links</h2>
            {!!igAccounts && igAccounts.length > 0 && (
              <div className="igAccount flex flex-col gap-1">
                {igAccounts.map(({ name, description }, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex gap-1 items-center">
                      <PostLogo logo="instagram" color="#1F262E" />
                      <Link
                        className="hover:underline hover:underline-offset-4 max-w-full break-words font-semibold text-hh-700 italic hover:text-hh-600 active:text-hh-800 visited:text-hh-500"
                        href={`https://instagram.com/${name}`}
                      >
                        @{name}
                      </Link>
                    </div>
                    <small className="text-xs">{description}</small>
                  </div>
                ))}
              </div>
            )}
            {!!link && (
              <div className="flex gap-1 mt-1">
                <div className="min-w-6 mt-1 flex justify-center">
                  <PostLogo logo="link" color="#1F262E" size="1rem" />
                </div>
                <Link
                  className="underline underline-offset-2 max-w-full break-words text-hh-700 italic hover:text-hh-600 active:text-hh-800 visited:text-hh-500"
                  href={link}
                >
                  {link}
                </Link>
              </div>
            )}
          </section>
        )}
      </section>
      {/* {"Augusto Ponce" !== addedBy.name && (
        <section id="addedBy" className="w-fit px-4 ml-auto self-end">
          <h2 className="text-lg font-semibold">Added by:</h2>
          <div className="flex items-center justify-end transition-all">
            <UserAvatar
              avatar={addedBy.image}
              name={addedBy.name}
              link={`/posts/suggestedBy/${addedBy.email}`}
            />
            <p className="addedByName hidden">{addedBy.name}</p>
          </div>
        </section>
      )} */}
    </main>
  );
}
