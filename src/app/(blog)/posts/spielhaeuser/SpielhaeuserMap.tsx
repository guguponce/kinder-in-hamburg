"use client";
import MarkersLists from "@app/components/@Map/PopUpsMarkers/MarkersLists";
import { iAddress, iPost } from "@app/utils/types";
import React, { useMemo, useRef, useState } from "react";
import GeneralMap from "@components/@Map/GeneralMap";
import { Marker, Popup } from "react-leaflet";
import { getPlainText, joinAddress } from "@app/utils/functions";
import { divIcon } from "leaflet";
import Link from "next/link";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import ExpandableContainer from "@app/components/ExpandableContainer";
import { createStandortMapIcon } from "@app/components/@Map/functions";

const ExpandableContainerMemo = React.memo(ExpandableContainer);
const OptionalExpandableContainer = ({
  children,
  length,
  expandable,
}: {
  expandable: boolean;
  children: React.ReactNode;
  length: number;
}) => (
  <div className="flex-grow">
    {expandable ? (
      <ExpandableContainerMemo
        type="Posts"
        contentHeight={length > 2 ? 250 : 200}
        initialHeight={length > 2 ? 240 : 190}
      >
        {children}
      </ExpandableContainerMemo>
    ) : (
      <>{children}</>
    )}
  </div>
);

const PostMarker = ({
  lat,
  lon,
  id,
  title,
  minAge,
  maxAge,
  stadtteil,
  bezirk,
  address,
}: {
  address: iAddress | undefined;
  title: string;
  minAge?: number;
  maxAge?: number;
  lat?: number;
  lon?: number;
  id: number;
  stadtteil?: string;
  bezirk?: string;
}) => (
  <Marker
    autoPan={true}
    icon={divIcon({
      html: createStandortMapIcon("#5C738A", 30),
      iconSize: [30, 30],
      iconAnchor: [30 / 2, 30],
      className: "bg-transparent",
    })}
    key={id}
    position={[lat!, lon!]}
  >
    <Popup className="font-sans">
      <Link href={`/posts/${id}`} className="font-semibold text-base block">
        {title}
      </Link>
      {minAge !== undefined && maxAge !== undefined && (
        <small className="font-semibold italic">
          Altersgruppe: {minAge} - {maxAge}
        </small>
      )}
      {address && (
        <p className="text-xs">
          {joinAddress(address)}
          <span className="block text-xs font-semibold">
            {stadtteil} - {bezirk}
          </span>
        </p>
      )}
    </Popup>{" "}
  </Marker>
);

export default function SpielhaeuserMap({ sphList }: { sphList: iPost[] }) {
  const bezirke = useRef(
    Array.from(new Set(sphList.map(({ bezirk }) => bezirk))).sort()
  );
  const bezirkeSph = useRef(
    sphList.reduce(
      (acc, sph) => {
        if (!acc[sph.bezirk]) acc[sph.bezirk] = [sph];
        else acc[sph.bezirk] = [...acc[sph.bezirk], sph];
        return acc;
      },
      {} as { [x: string]: iPost[] }
    )
  );

  const [alter, setAlter] = useState<undefined | string>();
  const [bezirkFilter, setBezirkFilter] = useState<undefined | string>();

  const bezirkList = useMemo(() => {
    if (!bezirkFilter) return bezirkeSph.current;
    return { [bezirkFilter]: bezirkeSph.current[bezirkFilter] };
  }, [bezirkFilter]);

  const displayList = useMemo(() => {
    if (!alter) return bezirkList;
    const [min, max] = alter.split("-").map(Number);
    const currentBezirke = Object.entries(bezirkList);
    let result: { [x: string]: iPost[] } = {};
    currentBezirke.forEach(([bezirk, bezirkSphList]) => {
      result[bezirk] = bezirkSphList.filter(({ minAge, maxAge, title }) => {
        if (minAge === undefined || maxAge === undefined) return false;
        if (max < minAge || min > maxAge) return false;
        return true;
      });
    });
    return result;
  }, [bezirkList, alter]);

  const markersList = useMemo(() => {
    return Object.values(displayList).flat();
  }, [displayList]);
  return (
    <section className="flex flex-col items-center gap-4 w-full max-w-[800px] p-4 rounded-md bg-gradient-to-b from-hh-50 to-hh-100 bg-opacity-20">
      <article className="w-full h-[400px]">
        <GeneralMap zoom={10}>
          <MarkersLists
            lists={{ posts: markersList }}
            cluster={false}
            customPostMarker={PostMarker}
          />
        </GeneralMap>
      </article>
      <div className="flex flex-col gap-4 rounded bg-gradient-to-b from-hh-500 to-hh-600 p-2 w-full font-sans">
        <div id="alter-select" className="flex flex-col gap-2 text-hh-50">
          <h3 className="font-semibold">Alter {alter}</h3>
          <div className="flex flex-wrap gap-2 items-center min-h-9">
            {["0-3", "4-6", "7-9", "10-14", "15-18"].map((age) => (
              <button
                key={age}
                className={`${alter && alter !== age && "opacity-75"} ${
                  alter === age && "font-semibold"
                } py-1 px-2 rounded bg-hh-50 bg-opacity-10 min-w-[calc(${
                  age.length
                }ch + 1rem)]`}
                onClick={() => setAlter(age)}
              >
                {age} Jahre
              </button>
            ))}
            {!!alter && (
              <button
                className="py-1 px-2 rounded bg-hh-50 font-semibold border border-hh-200 bg-opacity-10 opacity-75"
                onClick={() => setAlter(undefined)}
              >
                Alle
              </button>
            )}
          </div>
        </div>
        <div id="bezirk-select" className="flex flex-col gap-2 text-hh-50">
          <h3 className="font-semibold">Bezirk</h3>
          <div className="flex flex-wrap gap-2  items-center min-h-9">
            {bezirke.current.map((bezirk) => (
              <button
                key={bezirk}
                className={`${
                  bezirkFilter && bezirkFilter !== bezirk && "opacity-75"
                } ${
                  bezirkFilter === bezirk && "font-semibold"
                } py-1 px-2 rounded bg-hh-50 bg-opacity-10`}
                onClick={() => setBezirkFilter(bezirk)}
              >
                {bezirk}
              </button>
            ))}
            {!!bezirkFilter && (
              <button
                className="py-1 px-2 rounded bg-hh-50 font-semibold border border-hh-200 bg-opacity-10 opacity-75"
                onClick={() => setBezirkFilter(undefined)}
              >
                Überall in Hamburg
              </button>
            )}
          </div>
        </div>
      </div>
      <section
        id="sph-list"
        className="flex flex-wrap items-stretch gap-4 w-full max-w-[800px] p-4 rounded-md bg-gradient-to-b from-hh-50 to-hh-100 bg-opacity-20"
      >
        {Object.keys(displayList)
          .sort()
          .map((bezirk) => {
            const sphQuantity = displayList[bezirk].length;
            return (
              <div
                key={bezirk}
                className={`${
                  sphQuantity > 1 ? "w-full" : "w-[calc(50%-0.5rem)] p-2"
                } flex flex-col`}
              >
                <h2
                  className={`${
                    sphQuantity > 1 && "px-2"
                  } font-semibold text-hh-800`}
                >
                  {bezirk}
                </h2>
                <OptionalExpandableContainer
                  length={sphQuantity}
                  expandable={sphQuantity > 2 && !bezirkFilter}
                >
                  <article className="flex flex-wrap gap-2 w-full h-full">
                    {displayList[bezirk].map((post) => (
                      <React.Fragment key={post.id}>
                        <HorizontalCard
                          type="post"
                          id={post.id}
                          title={post.title}
                          link={`/${
                            post.status === "approved"
                              ? "posts"
                              : "post-suggestions"
                          }/${post.id}`}
                          image={(post.image && post.image[0]) || ""}
                        >
                          <HorizontalCard.PostInfo
                            title={post.title}
                            description={
                              getPlainText(post.text).slice(0, 100) + "..."
                            }
                            stadtteil={post.stadtteil}
                          />
                        </HorizontalCard>
                      </React.Fragment>
                    ))}
                  </article>
                </OptionalExpandableContainer>
              </div>
            );
          })}
      </section>
    </section>
  );
}
