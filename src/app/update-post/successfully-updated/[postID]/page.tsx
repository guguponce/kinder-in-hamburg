import React from "react";
import { revalidateAndRoute } from "@app/utils/actions/revalidate";
import SuccessfulSubmit from "@components/@PostForm/SuccessfulSubmit";
export default function SuccessfulPage({
  params: { postID },
}: {
  params: { postID: string };
}) {
  if (postID) {
    revalidateAndRoute(postID);
  }

  return <SuccessfulSubmit update={true} postID={postID} />;
}
