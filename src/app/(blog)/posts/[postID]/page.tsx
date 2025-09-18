import {
  checkIfPostExists,
  getApprovedPostWithID,
  getPostMetadata,
} from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import PostTemplate from "@components/PostTemplate";
import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import AdminEditButtons from "@components/@Buttons/AdminEditButtons";
import { redirect } from "next/navigation";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import type { Metadata } from "next";
import { getPlainText, parseDescriptionWithTags } from "@app/utils/functions";
interface PostPageProps {
  params: { postID: string };
}
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const postInfo = await getPostMetadata(params.postID);
  if (!postInfo)
    return {
      title: "Beitrag nicht gefunden",
      description: "Der Beitrag wurde nicht gefunden.",
    };
  const { title, text: description, image, bezirk, stadtteil } = postInfo;
  return {
    title: title,
    description:
      "Empfehlung in " + stadtteil || "" + bezirk
        ? `,${bezirk}. `
        : ". " + description || "",
    openGraph: {
      type: "website",
      url: "https://www.kinder-in-hamburg.de/posts/" + params.postID,
      title: title,
      description: parseDescriptionWithTags(
        getPlainText(description)?.slice(0, 100)
      ),
      images: postInfo.image || process.env.BASE_URL + "opengraph-image.png",
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      description:
        "Empfehlung in " + stadtteil || "" + bezirk
          ? `,${bezirk}. `
          : ". " + description || "",

      title: title,
      images: postInfo.image || process.env.BASE_URL + "opengraph-image.png",
      site: "https://www.kinder-in-hamburg.de/posts/" + params.postID,
      card: "summary_large_image",
    },
  };
}
export default async function CurrentPostPage({
  params,
}: {
  params: { postID: string };
}) {
  const { postID } = params;
  const post = await getApprovedPostWithID(postID);
  if (post === false) {
    const user = await getServerUser();
    if (!!user) {
      const postExists = await checkIfPostExists(postID, "kih-suggestions");
      if (postExists) {
        redirect(`/post-suggestion/${postID}`);
      }
    }
  }
  if (!post) return <NotFound />;
  return (
    <>
      {post.categories.includes("Badeplatz") ? (
        <>
          <AdminEditButtons
            deleteButton={{
              type: "post",
              deleteFrom: "approved",
              id: post.id,
              title: post.title,
              size: "medium",
            }}
            updateButton={{
              link: `/update-post/${postID}`,
              size: "medium",
              status: post.status,
              type: "post",
            }}
            addLatLonButton={{
              item: post,
            }}
          />
          <PostTemplate post={post} />
        </>
      ) : (
        <AdminRoute>
          <>
            <AdminEditButtons
              deleteButton={{
                type: "post",
                deleteFrom: "approved",
                id: post.id,
                title: post.title,
                size: "medium",
              }}
              updateButton={{
                link: `/update-post/${postID}`,
                size: "medium",
                status: post.status,
                type: "post",
              }}
              addLatLonButton={{
                item: post,
              }}
            />
            <PostTemplate post={post} />
          </>
        </AdminRoute>
      )}
    </>
  );
}
