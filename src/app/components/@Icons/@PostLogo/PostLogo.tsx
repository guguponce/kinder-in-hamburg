import React, { lazy, Suspense } from "react";

const LazyShuffleIcon = lazy(() => import("../ShuffleIcon"));
const LazyTriangleIcon = lazy(() => import("../TriangleIcon"));
const LazyDateIcon = lazy(() => import("./DateIcon"));
const LazyClockIcon = lazy(() => import("./ClockIcon"));
const LazyLogo = lazy(() => import("./Logo"));
const LazyHamburgIcon = lazy(() => import("./HamburgIcon"));
const LazyMapIcon = lazy(() => import("./MapIcon"));
const LazyLinkIcon = lazy(() => import("./LinkIcon"));
const LazyInstagramIcon = lazy(() => import("./InstagramIcon"));

export default function PostLogo({
  size = "24px",
  color = "#000",
  color2 = "#f0f1f2",
  logo,
  lazy = false,
}: {
  lazy?: boolean;
  size?: string;
  color?: string;
  color2?: string;
  logo: string;
}) {
  if (lazy) {
    return (
      <Suspense
        fallback={
          logo === "shuffle" ? (
            <p className="font-semibold">Ziellos</p>
          ) : (
            <div>Loading...</div>
          )
        }
      >
        {logo === "shuffle" && <LazyShuffleIcon size={size} color={color} />}
        {logo === "triangle" && <LazyTriangleIcon size={size} color={color} />}
        {logo === "date" && <LazyDateIcon size={size} color={color} />}
        {logo === "logo" && (
          <LazyLogo size={size} color={color} color2={color2} />
        )}
        {logo === "clock" && <LazyClockIcon size={size} color={color} />}
        {logo === "hamburg" && <LazyHamburgIcon size={size} color={color} />}
        {logo === "map" && <LazyMapIcon size={size} color={color} />}
        {logo === "link" && <LazyLinkIcon size={size} color={color} />}
        {logo === "instagram" && (
          <LazyInstagramIcon size={size} color={color} />
        )}
      </Suspense>
    );
  }
  return (
    <>
      {logo === "shuffle" && <LazyShuffleIcon size={size} color={color} />}
      {logo === "triangle" && <LazyTriangleIcon size={size} color={color} />}
      {logo === "date" && <LazyDateIcon size={size} color={color} />}
      {logo === "clock" && <LazyClockIcon size={size} color={color} />}
      {logo === "logo" && (
        <LazyLogo size={size} color={color} color2={color2} />
      )}
      {logo === "hamburg" && <LazyHamburgIcon size={size} color={color} />}
      {logo === "map" && <LazyMapIcon size={size} color={color} />}
      {logo === "link" && <LazyLinkIcon size={size} color={color} />}
      {logo === "instagram" && <LazyInstagramIcon size={size} color={color} />}
    </>
  );
}
