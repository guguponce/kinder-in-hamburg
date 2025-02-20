import { iPost } from "@app/utils/types";
import Link from "next/link";
import React from "react";
import DisplayTypeText from "./@PostForm/DisplayTypeText";
import PostLogo from "./@Icons/@PostLogo/PostLogo";
import ImagesModalGallery from "./ImagesModalGallery";
import RecommendationsMap from "@app/components/@Map/RecommendationsMap";
import TopLinks from "./@Templates/TopLinks";
import LocationBox from "./@Templates/LocationBox";
import LinksBox from "./@Templates/LinksBox";

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
      className="w-full max-w-[1200px] rounded-lg p-2 lg:p-4 relative mx-1"
    >
      {children}
      <article
        id="text"
        className="w-full lg:self-start p-4 rounded-md bg-hh-50 flex flex-col gap-4 my-2 overflow-hidden"
      >
        <TopLinks
          categories={categories}
          pinnedPost={pinnedPost}
          title={title}
        />
        <h1 className="text-4xl text-center font-bold">{title}</h1>
        {!!image?.length && (
          <section
            id="posts-images"
            className="flex items-center justify-center gap-2 h-48"
          >
            {/* <div className="flex justify-center items-center w-full overflow-hidden"> */}
            <ImagesModalGallery images={image} title={title} />
            {/* </div> */}
          </section>
        )}
        <article className="flex flex-col break-words w-fit self-center max-w-full sm:px-4 md:px-0">
          {text.map(([type, text], i) => (
            <React.Fragment key={text + i}>
              <DisplayTypeText type={type} text={text} />
            </React.Fragment>
          ))}
        </article>
        <div className="flex items-stretch  gap-2 flex-wrap">
          {((minAge && minAge > 0) || !!maxAge) && (
            <section
              id="age"
              // className="w-full lg:min-w-fit xl:w-fit bg-hh-200 bg-opacity-25 rounded p-4"
              className="px-4 bg-hh-200 text-hh-800 bg-opacity-40 rounded p-4 w-full shadow sm:w-fit sm:max-w-[50%]"
            >
              <h2 className="text-lg font-semibold">Alter Empfehlung</h2>
              <p>
                {maxAge ? `${minAge} - ${maxAge} Jahren` : `${minAge}+ Jahren`}
              </p>
            </section>
          )}

          {(!!link || !!igAccounts?.length) && (
            <LinksBox igAccounts={igAccounts} link={link} />
          )}
        </div>
        <p className="italic text-xs text-hh-500 text-end self-end">
          {lastUpdate && lastUpdate !== createdAt
            ? `(Letztes Update: ${new Date(lastUpdate).toLocaleDateString()})`
            : `(${new Date(createdAt).toLocaleDateString()})`}
        </p>
      </article>
      <section
        id="post-details"
        className={`w-full mx-auto max-w-[800px] mt-2 bg-gradient-to-b from-hh-800 to-hh-700 bg-opacity-75 p-1 rounded-md flex flex-wrap flex-col sm:flex-row gap-2 ${
          (!!bezirk || !!address) && (!!link || !!igAccounts?.length)
            ? "justify-center sm:justify-between"
            : "justify-center"
        }`}
      >
        {(!!bezirk || !!address) && (
          <div className="flex w-full flex-col sm:flex-row lg:flex-col xl:flex-row flex-wrap-reverse gap-2 sm:gap-1">
            <LocationBox
              address={address}
              bezirk={bezirk}
              stadtteil={stadtteil}
            />
          </div>
        )}
        <RecommendationsMap
          id={id}
          bezirk={bezirk}
          stadtteil={stadtteil}
          currentType="post"
          maxDistance={1000}
        />
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
