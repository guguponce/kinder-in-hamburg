import {
  getApprovedPostWithID,
  getSuggestedPostWithID,
} from "@app/api/dbActions";
import DisplayTypeText from "@app/components/@PostForm/DisplayTypeText";
import PostLogo from "@app/components/@Icons/PostLogo";
import PostTemplate from "@app/components/PostTemplate";
import { parseAddress, parsePost } from "@app/utils/functions";
import { TypeAndText } from "@app/utils/types";
import Link from "next/link";
import React from "react";

export default async function CurrentPostPage({
  params,
}: {
  params: { suggestionID: string };
}) {
  const { suggestionID } = params;
  const parsedPost = parsePost(await getSuggestedPostWithID(suggestionID));

  const approvedPost = await getApprovedPostWithID(suggestionID);
  return (
    <PostTemplate post={parsedPost}>
      <div className="flex self-center justify-center items-center rounded-md border-2 border-hh-600 bg-hh-200 mb-4 p-2">
        {approvedPost ? (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold">
              This sugggestion has already been approved
            </h2>
            <Link href={`/posts/${approvedPost.id}`}>Check it out!</Link>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold">
              This sugggestion has still not been approved
            </h2>
            <small className="text-xs">(You can modify it if you want)</small>
            <Link
              href={`/update-suggestion/${suggestionID}`}
              className="px-2 py-1 bg-hh-700 hover:bg-hh-600 active:bg-hh-500 text-white rounded-md"
            >
              Update suggestion
            </Link>
          </div>
        )}
      </div>
    </PostTemplate>
  );
}
