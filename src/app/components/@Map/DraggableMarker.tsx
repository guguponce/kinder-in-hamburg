"use client";
import { DivIcon, divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { createStandortMapIcon, createUserMapIcon } from "./functions";
import { useEffect, useMemo, useRef, useState } from "react";
import { UserLocationIcon } from "./MarkerIcons";

export default function DraggableMarker({
  pos,
  onChangePosition,
  icon,
  children,
}: {
  icon?: DivIcon;
  onChangePosition: ({ lat, lon }: { lat: number; lon: number }) => void;
  pos: { lat: number; lon: number } | null;
  children?: React.ReactNode;
}) {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng: lon } = (marker as any).getLatLng();
          onChangePosition({ lat, lon });
        }
      },
    }),
    [onChangePosition]
  );
  if (!pos) return null;
  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={[pos.lat, pos.lon]}
      ref={markerRef}
      icon={icon || UserLocationIcon}
    >
      <Popup minWidth={90}>{children}</Popup>
    </Marker>
  );
}
