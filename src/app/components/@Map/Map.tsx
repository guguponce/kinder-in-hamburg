"use client";
import React, { useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { categoryName, iFlohmarkt, iPost } from "@app/utils/types";
import Link from "next/link";
import { getDate, isTypePost, joinAddress } from "@app/utils/functions";

const bezirkLocationIcon = new Icon({
  iconUrl: "/assets/icons/bezirkLocation.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

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

const Map = ({
  postID,
  postsNearby,
  currentTarget,
}: {
  postID: string;
  currentTarget?: iPost | iFlohmarkt;
  postsNearby: iPost[];
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<
    categoryName | undefined
  >();
  const categories = useRef(
    Array.from(new Set(postsNearby.map((p) => p.categories).flat()))
  );
  const displayedMarkers = useMemo(
    () =>
      selectedCategory
        ? postsNearby.filter((p) => p.categories.includes(selectedCategory))
        : postsNearby,
    [selectedCategory, postsNearby]
  );

  return (
    <section className="w-[calc(100%-2rem)] max-w-[800px] flex flex-col gap-2 items-center rounded">
      <aside className="flex flex-wrap justify-center gap-2">
        {categories.current.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as categoryName)}
            className={`p-2 rounded-md ${
              selectedCategory === category
                ? "bg-hh-900 text-white"
                : "bg-white text-hh-900"
            }`}
          >
            {category}
          </button>
        ))}
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(undefined)}
            className="p-2 rounded-md bg-white text-hh-900"
          >
            All Categories
          </button>
        )}
      </aside>
      <article className="h-[60vh] w-full max-w-[800px] flex justify-center rounded overflow-hidden">
        <MapContainer
          style={{ height: "100%", width: "100%", zIndex: 10 }}
          center={[currentTarget?.lat || 53.5511, currentTarget?.lon || 9.9937]}
          zoom={10}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {currentTarget?.lat && currentTarget?.lon && (
            <Marker
              position={[currentTarget.lat, currentTarget.lon]}
              icon={MainLocationIcon}
            >
              <Popup className="font-sans">
                <Link
                  href={
                    isTypePost(currentTarget)
                      ? `/posts/${postID}`
                      : `/flohmaerkte/${postID}`
                  }
                  className="font-semibold text-base block"
                >
                  {currentTarget.title}
                </Link>
                <small className="font-semibold italic">
                  {isTypePost(currentTarget)
                    ? (currentTarget as iPost).categories.join(" - ")
                    : getDate((currentTarget as iFlohmarkt).date)}
                </small>
                <p className="text-xs">
                  {currentTarget.address &&
                    (typeof currentTarget.address === "string"
                      ? currentTarget.address
                      : joinAddress(currentTarget.address))}
                </p>
              </Popup>
            </Marker>
          )}
          {displayedMarkers.map(({ title, id, lat, lon, categories }) =>
            !lat || !lon ? null : (
              <React.Fragment key={id}>
                <Marker
                  position={[lat, lon]}
                  icon={
                    // stadtteilLocationIcon
                    bezirkLocationIcon
                  }
                >
                  <Popup className="font-sans">
                    <Link
                      href={`/posts/${id}`}
                      className="font-semibold text-base block"
                      target="_blank"
                    >
                      {title}
                    </Link>
                    <small className="font-semibold italic">
                      ({categories.join(" - ")})
                    </small>
                  </Popup>
                </Marker>
              </React.Fragment>
            )
          )}
        </MapContainer>
      </article>
    </section>
  );
};

export default Map;
