import { iParsedRetrievedPost } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import DisplayTypeText from "./@PostForm/DisplayTypeText";
import PostLogo from "./@Icons/PostLogo";
import UserAvatar from "./UserAvatar";

export default function PostTemplate({
  post: {
    title,
    image,
    text,
    createdAt,
    lastUpdate,
    bezirk,
    address,
    minAge,
    maxAge,
    link,
    igAccounts,
    tags,
    addedBy,
    categories,
  },
  children,
}: {
  post: iParsedRetrievedPost;
  children?: React.ReactNode;
}) {
  return (
    <main className="w-full max-w-[1000px] bg-hh-100 rounded-lg p-6 relative flex flex-col">
      {children}
      <div className="flex justify-between items-center gap-4">
        <Link
          href={"/posts"}
          className="text-sm text-hh-700 px-2 py-1 hover:underline hover:underline-offset-4 min-w-fit"
        >
          ← All Posts
        </Link>
        <section
          id="categories"
          className="flex justify-end gap-1 h-fit flex-wrap"
        >
          {categories.map((cat) => (
            <Link
              className="px-2 py-1 h-fit leading-tight rounded-md align-middle font-semibold bg-transparent transition-all text-hh-700 hover:text-white hover:bg-hh-700"
              key={cat}
              href={`/categories/${encodeURIComponent(cat)}`}
            >
              {cat}
            </Link>
          ))}
        </section>
      </div>
      <section id="text" className="w-full p-4 my-6 rounded-md bg-hh-50 ">
        <h1 className="text-4xl text-center font-bold">{title}</h1>
        {!!image?.length && (
          <div className="flex justify-center items-center w-full overflow-hidden my-4">
            <div className="flex  gap-2 w-fit overflow-x-auto">
              {image.map((img, i) => (
                <div
                  key={img}
                  className="min-w-[200px] max-w-[300px] h-auto max-h-[400px]"
                >
                  <img
                    key={"img" + i}
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {text.map(([type, text], i) => (
          <DisplayTypeText key={text} type={type} text={text} />
        ))}

        <p className="italic text-xs text-hh-500 text-end self-end">
          {lastUpdate && lastUpdate === createdAt
            ? `(Last updated: ${new Date(lastUpdate).toLocaleDateString()})`
            : `(${new Date(createdAt).toLocaleDateString()})`}
        </p>
      </section>
      <section className="flex flex-wrap justify-between">
        {(!!bezirk || !!address) && (
          <div className="flex flex-col w-1/2">
            <section id="location" className="w-full px-4 my-2">
              <h2 className="text-lg font-semibold">Location:</h2>
              <h3 id="bezirk" className="font-semibold italic">
                {bezirk}
              </h3>
              {!!address && (
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
              )}
            </section>

            {((minAge && minAge > 0) || !!maxAge) && (
              <section id="age" className="w-full px-4 my-2">
                <h2 className="text-lg font-semibold">Alter Empfehlung:</h2>
                <p>
                  {maxAge
                    ? `${minAge} - ${maxAge} Jahren`
                    : `${minAge}+ Jahren`}
                </p>
              </section>
            )}
          </div>
        )}
        {(!!link || !!igAccounts) && (
          <section id="links-box" className="w-1/2 px-4 my-2">
            <h2 className="text-lg font-semibold">Links:</h2>
            {igAccounts && igAccounts.length > 0 && (
              <div className="igAccount flex flex-col gap-1">
                {igAccounts.map(({ name, description }, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex gap-1 items-center">
                      <PostLogo logo="instagram" color="#1F262E" />
                      <Link
                        className="hover:underline hover:underline-offset-4 font-semibold text-hh-700 italic hover:text-hh-600 active:text-hh-800 visited:text-hh-500"
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
              <div className="flex gap-1 items-center">
                <PostLogo logo="link" color="#1F262E" size="1rem" />
                {link}
                <Link
                  className="underline underline-offset-2 mt-1 text-hh-700 italic hover:text-hh-600 active:text-hh-800 visited:text-hh-500"
                  href={link}
                >
                  {link}
                </Link>
              </div>
            )}
          </section>
        )}
      </section>
      {!!tags.length && (
        <section id="text" className="w-full px-4 my-2">
          <h2 className="text-lg font-semibold">#TAGS</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="px-2 italic border-2 border-hh-700 py-1 h-fit leading-tight rounded-md align-middle font-semibold bg-transparent transition-all text-hh-700 hover:text-white hover:bg-hh-700"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="addedBy" className="w-full px-4 my-2">
        <h2 className="text-lg font-semibold">Added by:</h2>
        <div className="flex items-center transition-all">
          <UserAvatar
            avatar={addedBy.image}
            name={addedBy.name}
            link={`/posts/suggestedBy/${addedBy.email}`}
          />
          <p className="addedByName hidden">{addedBy.name}</p>
        </div>
      </section>
    </main>
  );
}