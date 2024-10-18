import { getPostWithBezirk } from "@app/api/dbActions";
import { addLatLongToPost, getLatLong } from "@app/utils/functions";
import { iBezirk, iPost } from "@app/utils/types";
import dynamic from "next/dynamic";
import MarkersLists from "./PopUpsMarkers/MarkersLists";

const GeneralMap = dynamic(() => import("./GeneralMap"), { ssr: false });

export default async function DynamicMap({
  postID,
  bezirk,
}: {
  postID: string;
  bezirk: iBezirk;
}) {
  const bezirkPosts = await getPostWithBezirk(bezirk);
  if (!bezirkPosts) return <>No posts from the zone</>;
  const postsWithCoordinates = (
    await Promise.all(bezirkPosts.map(async (post) => addLatLongToPost(post)))
  ).filter(Boolean) as iPost[];
  const currentTarget = postsWithCoordinates.find(
    (p) => p.id === parseInt(postID)
  );
  if (!currentTarget) return <></>;
  return (
    <GeneralMap>
      <MarkersLists lists={{ posts: postsWithCoordinates }} showPosts={true} />
    </GeneralMap>
  );
}
