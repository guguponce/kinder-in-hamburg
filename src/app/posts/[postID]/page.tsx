import { getPostWithID } from "@app/api/dbActions";
import DisplayTypeText from "@app/components/@PostForm/DisplayTypeText";
import { parseAddress, parsePost } from "@app/utils/functions";
import { TypeAndText } from "@app/utils/types";
import Link from "next/link";
import React from "react";

export default async function CurrentPostPage({
  params,
}: {
  params: { postID: string };
}) {
  const { postID } = params;
  const post = parsePost(await getPostWithID(postID));
  const {
    title,
    text,
    tags,
    minAge,
    maxAge,
    link,
    lastUpdate,
    image,
    igAccounts,
    createdAt,
    categories,
    bezirk,
    address,
    addedBy,
  } = post;
  const parsedAddress = !address ? undefined : parseAddress(address);
  return (
    <main className="w-full max-w-[1000px] bg-hh-100 rounded-lg p-6 relative flex flex-col">
      <div className="flex justify-between flex-wrap items-center">
        <Link
          href={"/posts"}
          className="text-sm text-hh-700 px-2 py-1 hover:bg "
        >
          ← All Posts
        </Link>
        <section id="categories" className="flex gap-1 h-fit">
          {categories.map((cat) => (
            <Link
              className="px-2 py-1 h-fit leading-tight rounded-md align-middle font-semibold bg-transparent transition-all text-hh-700 hover:text-white hover:bg-hh-700"
              key={cat}
              href={`categories/${cat}`}
            >
              {cat}
            </Link>
          ))}
        </section>
      </div>
      <section id="text" className="w-full p-4 my-2 rounded-md bg-hh-50 ">
        <h1 className="text-4xl text-center font-bold">{post.title}</h1>
        {!!image?.length &&
          image.map((img, i) => (
            <img
              key={"img" + i}
              src={img}
              alt={title}
              className="w-full h-96 object-cover rounded-md my-4"
            />
          ))}
        {typeof text === "string" ? (
          <p>{text}</p>
        ) : (
          text.map(([type, text], i) => (
            <DisplayTypeText key={text} type={type} text={text} />
          ))
        )}

        <p className="italic text-xs text-hh-500 text-end self-end">
          {lastUpdate && lastUpdate === createdAt
            ? `(Last updated: ${new Date(lastUpdate).toLocaleDateString()})`
            : `(${new Date(createdAt).toLocaleDateString()})`}
        </p>
      </section>
      <div className="flex flex-wrap justify-between">
        <div className="flex flex-col w-1/2">
          <section id="location" className="w-full px-4 my-2">
            <h2 className="text-lg font-semibold">Location:</h2>
            <h3 id="bezirk" className="font-semibold italic">
              {bezirk}
            </h3>
            {address && (
              <p className="italic">
                {address.street} {address.number}, {address.PLZ} {address.city}
              </p>
            )}
          </section>

          {((minAge && minAge > 0) || !!maxAge) && (
            <section id="age" className="w-full px-4 my-2">
              <h2 className="text-lg font-semibold">Alter Empfehlung:</h2>
              <p>
                {maxAge ? `${minAge} - ${maxAge} Jahren` : `${minAge}+ Jahren`}
              </p>
            </section>
          )}
        </div>
        {link && (
          <section id="link" className="w-1/2 px-4 my-2">
            <h2 className="text-lg font-semibold">Link:</h2>
            {igAccounts && igAccounts.length > 0 && (
              <div className="igAccount flex flex-col gap-1">
                {igAccounts.map(({ name, description }, i) => (
                  <div key={i} className="flex flex-col">
                    ig icon
                    <Link
                      className="underline underline-offset-4 font-semibold text-hh-700 italic hover:text-hh-600 active:text-hh-800 visited:text-hh-500"
                      href={`https://instagram.com/${name}`}
                    >
                      @{name}
                    </Link>
                    <small className="text-xs">{description}</small>
                  </div>
                ))}
              </div>
            )}

            <Link
              className="underline underline-offset-2 mt-1 text-hh-700 italic hover:text-hh-600 active:text-hh-800 visited:text-hh-500"
              href={link}
            >
              link icon : {link}
            </Link>
          </section>
        )}
      </div>
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
          {addedBy.image ? (
            <img
              title={addedBy.name || ""}
              className="w-10 h-10 rounded-full mr-2"
              src={addedBy.image}
              alt={addedBy.name
                ?.split(" ")
                .map((word) => word[0].toLocaleUpperCase())
                .join("")}
            />
          ) : (
            addedBy.name && (
              <p className="font-bold rounded-full mr-2" title={addedBy.name}>
                {addedBy.name
                  .split(" ")
                  .map((word) => word[0].toLocaleUpperCase())
                  .join("")}
              </p>
            )
          )}
          <p className="addedByName hidden">{addedBy.name}</p>
        </div>
      </section>

      {Object.entries(post)
        .filter(
          ([key]) =>
            ![
              "addedBy",
              "address",
              "bezirk",
              "link",
              "lastUpdate",
              "createdAt",
              "id",
              "minAge",
              "maxAge",
              "pinnedPost",
              "user_id",
              "tags",
              "text",
              "igAccounts",
              "title",
              "categories",
            ].includes(key)
        )
        .map(([key, val]) => (
          <div key={key} className="p-4 rounded-md bg-hh-200">
            <h3 className="font-semibold">{key}</h3>
            <div className="break-words">
              {key === "text"
                ? (val as TypeAndText[]).map(([type, text], i) => (
                    <DisplayTypeText key={i} type={type} text={text} />
                  ))
                : ["number", "string"].includes(typeof val)
                ? val
                : !!val
                ? JSON.stringify(val)
                : "NO VALUE"}
            </div>
          </div>
        ))}
    </main>
  );
}
