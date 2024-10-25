"use client";
import { createStandortMapIcon } from "@app/utils/functions";
import { Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import FlohmarktPopUP from "@app/components/@Map/PopUpsMarkers/FlohmarktPopUP";

export const laterneIcon = divIcon({
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  className: "laterneIcon",
});

export const LaterneMarker = ({
  title,
  lat,
  lon,
  id,
  address,
  date,
  image,
}: {
  date: number;
  image?: string;
  address: string;
  title: string;
  lat: number;
  lon: number;
  id: number;
}) => {
  return (
    <Marker key={id} position={[lat, lon]} icon={laterneIcon}>
      <FlohmarktPopUP
        address={address}
        title={title}
        date={date}
        image={image}
        id={id}
      />
    </Marker>
  );
};
