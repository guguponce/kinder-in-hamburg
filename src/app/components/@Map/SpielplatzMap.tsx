"use client";
import React, { useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { iBezirk, iSpielplatz } from "@app/utils/types";
import Link from "next/link";
import { getDate, joinAddress } from "@app/utils/functions";
import GeneralMap from "./GeneralMap";

const stadtteilLocationIcon = new Icon({
  iconUrl: "/assets/icons/stadtteilLocation.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const MainLocationIcon = new Icon({
  iconUrl: "/assets/icons/currentLocation.svg",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const SpielplaetzeMap = ({
  spID,
  spielplaetzeList,
  currentTarget,
}: {
  spID?: string | undefined;
  currentTarget?: iSpielplatz;
  spielplaetzeList: iSpielplatz[];
}) => {
  // const bezirke = useRef(
  //   Array.from(new Set(spielplaetzeList.map((p) => p.bezirk).flat())),
  // );

  // const spielplaetzeBezirke = useRef(
  //   Array.from(new Set(spielplaetzeList.map(({ bezirk }) => bezirk))),
  // );
  // const [selectedSpielplatz, setSelectedSpielplatz] = React.useState<
  //   number | undefined
  // >(currentTarget?.id);
  // const [selectedBezirk, setSelectedBezirk] = React.useState<
  //   iBezirk | undefined
  // >();
  const displayedMarkers = useMemo(() => {
    const restSpielplaetze = spielplaetzeList.filter(
      ({ id }) => id.toString() !== spID,
    );
    return restSpielplaetze;
    // return selectedBezirk
    //   ? restSpielplaetze.filter((p) => p.bezirk === selectedBezirk)
    //   : restSpielplaetze;
  }, [spielplaetzeList, spID]);
  const centralSpielplatz = currentTarget || displayedMarkers[0];

  return (
    <section className="w-full sm:w-[calc(100%-2rem)] md:max-w-[800px] flex flex-col gap-2 sm:gap-4 items-center rounded">
      <article className="h-[60vh] w-full max-w-[800px] flex justify-center rounded overflow-hidden">
        <GeneralMap
          showUserLocation
          zoom={18}
          currentTarget={{
            lat: centralSpielplatz?.lat || 53.5511,
            lon: centralSpielplatz?.lon || 9.9937,
          }}
        >
          {currentTarget && (
            <Marker
              position={[currentTarget.lat, currentTarget.lon]}
              icon={MainLocationIcon}
            >
              <Popup className="font-sans">
                <Link
                  href={`/spielplaetze/${spID}`}
                  className="font-semibold text-base block"
                >
                  {currentTarget.title}
                </Link>
                {currentTarget.address && (
                  <p className="text-xs">
                    {joinAddress(currentTarget.address)}
                  </p>
                )}
              </Popup>
            </Marker>
          )}
          {displayedMarkers.map(
            ({ title, address, id, lat, lon, stadtteil, bezirk }) => (
              <React.Fragment key={id}>
                <Marker
                  position={[lat, lon]}
                  icon={
                    currentTarget?.id === id
                      ? MainLocationIcon
                      : stadtteilLocationIcon
                  }
                >
                  <Popup className="font-sans">
                    <Link
                      href={`/spielplaetze/${id}`}
                      className="font-semibold text-base block"
                    >
                      {title}
                    </Link>
                    <p className="text-xs">
                      {stadtteil}, {bezirk}
                    </p>
                    {address && (
                      <p className="text-xs">{joinAddress(address)}</p>
                    )}
                  </Popup>
                </Marker>
              </React.Fragment>
            ),
          )}
        </GeneralMap>
      </article>
    </section>
  );
};

export default SpielplaetzeMap;
