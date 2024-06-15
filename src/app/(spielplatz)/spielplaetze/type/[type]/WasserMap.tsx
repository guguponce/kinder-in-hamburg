import { getApprovedPostWithCat } from "@app/api/dbActions";
import MarkersLists from "@app/components/@Map/PopUpsMarkers/MarkersLists";
import { joinAddress } from "@app/utils/functions";
import { iListsFPS, iPost, iSpielplatz } from "@app/utils/types";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";

const GeneralMap = dynamic(() => import("@components/@Map/GeneralMap"), {
  ssr: false,
  loading: () => (
    <article className="w-full max-w-[800px] h-[600px]">
      <img
        src="/assets/bezirke/hamburg.webp"
        alt="Hamburg"
        className="w-full h-full object-cover"
      />
    </article>
  ),
});

export default async function WasserMap({ lists }: { lists: iListsFPS }) {
  return (
    <>
      <div className="flex flex-wrap gap-4 py-4">
        {lists.posts?.map((post) => (
          <article
            key={post.id}
            className="flex flex-col gap-2 bg-white rounded p-2 "
          >
            <div className="flex flex-col">
              <h2 className="font-bold">{post.title}</h2>
              {post.address && <p>{joinAddress(post.address)}</p>}
              <p className="font-semibold">
                {post.bezirk}-{post.stadtteil}
              </p>
            </div>
            <div className="flex gap-2 justify-between">
              <Link
                href={`/update-post/${post.id}`}
                className="bg-positive-500 hover:bg-positive-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Edit
              </Link>
              <Link
                href={`/update-post/${post.id}`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Check
              </Link>
            </div>
          </article>
        ))}
      </div>

      <article className="w-full max-w-[800px] h-[600px]">
        <GeneralMap>
          <MarkersLists lists={lists} />
        </GeneralMap>
      </article>
    </>
  );
}
