"use client";
import { updateFlohmarkt } from "@app/api/dbActions";
import { revalidateFlohmarkt } from "@app/utils/actions/revalidate";
import { getLatLong } from "@app/utils/functions";
import { iFlohmarkt, iFlohmarktWithCoordinates } from "@app/utils/types";
import React from "react";

export default function AddLatLonFlohmarkt({
  flohmarkt,
}: {
  flohmarkt: iFlohmarkt;
}) {
  const [success, setSuccess] = React.useState(false);
  if (!flohmarkt.lat && !flohmarkt.lon && flohmarkt.date < new Date().getTime())
    return null;
  const addLatLon = async () => {
    if (!flohmarkt.address) return false;
    if (flohmarkt.lat && flohmarkt.lon)
      return flohmarkt as iFlohmarktWithCoordinates;
    const { lat, lon } = await getLatLong(flohmarkt.address);
    try {
      await updateFlohmarkt({
        ...flohmarkt,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      });
      setSuccess(true);
    } catch (e) {
      console.error(e);
    }
  };
  if (success) return <p>Success!</p>;
  return (
    <button
      className="bg-hh-700 text-white font-semibold p-2 rounded"
      onClick={() => addLatLon()}
    >
      Add Lat/Lon
    </button>
  );
}
