"use client";
import {
  updateApprovedPost,
  updateEvent,
  updateSuggestedPost,
} from "@app/api/dbActions";
import {
  getLatLong,
  isTypeEvent,
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
    if (lat === "0" || lon === "0") return false;
    try {
      await updateEvent(
        {
          ...flohmarkt,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        },
        flohmarkt.type ? "events" : "flohmaerkte"
      );
      return { lat, lon };
    } catch (e) {
      console.error(e);
    }
  } else if (isTypeSpielplatz(item)) {
    const spielplatz = item as iSpielplatz;
    if (!spielplatz.address) return false;
    const { lat, lon } = await getLatLong(joinAddress(spielplatz.address));
    if (lat === "0" || lon === "0") return false;
    try {
      await updateSpielplatz({
        ...spielplatz,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      });
      return { lat, lon };
    } catch (e) {
      console.error(e);
    }
  } else if (isTypePost(item)) {
    const post = item as iPost;
    if (!post.address) return false;
    const { lat, lon } = await getLatLong(joinAddress(post.address));
    if (lat === "0" || lon === "0") return false;
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
      return { lat, lon };
    } catch (e) {
      console.error(e);
    }
  }
};

export default function AddLatLon({
  item,
}: {
  item: iFlohmarkt | iSpielplatz | iPost;
}) {
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  if (!!item.lat && !!item.lon)
    return (
      <ClearLatLonButton
        type={
          isTypeFlohmarkt(item)
            ? "flohmarkt"
            : isTypeEvent(item)
              ? "event"
              : isTypePost(item)
                ? "post"
                : "spielplatz"
        }
        id={item.id.toString()}
      />
    );

  if (success) return <p>Success!</p>;
  if (error)
    return (
      <p className="border-2 border-negative-700 p-1 text-negative-800">
        Error
      </p>
    );

  return (
    <button
      className={`w-fit rounded px-2 py-2 font-semibold bg-hh-700 text-center text-white hover:bg-hh-800 active:bg-hh-600`}
      onClick={() => {
        addLatLon(item).then((res) => {
          return !!res ? setSuccess(true) : setError(!res);
        });
      }}
    >
      Add Lat/Lon
    </button>
  );
}
