import React from "react";
import { revalidate } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
export default function SuccessfulPage({
  params: { postID },
}: {
  params: { postID: string };
}) {
  if (postID) {
    revalidate();
  }
  return <SuccessfulSubmit postID={postID} type="approval" />;
}
