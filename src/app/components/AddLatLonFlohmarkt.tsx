"use client";
import {
  updateApprovedPost,
  updateFlohmarkt,
  updateSuggestedPost,
} from "@app/api/dbActions";
import {
  getLatLong,
  isTypeFlohmarkt,
  isTypePost,
  isTypeSpielplatz,
  joinAddress,
} from "@app/utils/functions";
import { iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import React from "react";
import ClearLatLonButton from "./@Icons/@Flohmarkt/ClearLatLonButton";
import { updateSpielplatz } from "@app/api/spActions";

const addLatLon = async (item: iFlohmarkt | iSpielplatz | iPost) => {
  if (!item.address) return false;
  if (item.lat && item.lon) return false;
  if (isTypeFlohmarkt(item)) {
    const flohmarkt = item as iFlohmarkt;
    const { lat, lon } = await getLatLong(flohmarkt.address);
    try {
      await updateFlohmarkt({
        ...flohmarkt,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      });
      return true;
    } catch (e) {
      console.error(e);
    }
  } else if (isTypeSpielplatz(item)) {
    const spielplatz = item as iSpielplatz;
    if (!spielplatz.address) return false;
    const { lat, lon } = await getLatLong(joinAddress(spielplatz.address));
    try {
      await updateSpielplatz({
        ...spielplatz,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      });
      return true;
    } catch (e) {
      console.error(e);
    }
  } else if (isTypePost(item)) {
    const post = item as iPost;
    if (!post.address) return false;
    const { lat, lon } = await getLatLong(joinAddress(post.address));
    try {
      await (post.status === "approved"
        ? updateApprovedPost({
            ...post,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
          })
        : updateSuggestedPost({
            ...post,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
          }));
      return true;
    } catch (e) {
      console.error(e);
    }
  }
};

export default function AddLatLonFlohmarkt({
  item,
}: {
  item: iFlohmarkt | iSpielplatz | iPost;
}) {
  const [success, setSuccess] = React.useState(false);
  if (!!item.lat && !!item.lon)
    return <ClearLatLonButton id={item.id.toString()} />;

  if (success) return <p>Success!</p>;
  return (
    <button
      className="bg-hh-700 text-white font-semibold p-2 rounded"
      onClick={() => {
        addLatLon(item).then(() => setSuccess(true));
      }}
    >
      Add Lat/Lon
    </button>
  );
}
