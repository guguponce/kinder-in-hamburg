import React, { lazy } from "react";

const AltonaIcon = lazy(() => import("./AltonaIcon"));
const HarburgIcon = lazy(() => import("./harburgIcon"));
const WandsbekIcon = lazy(() => import("./WandsbekIcon"));
const EimsbuettelIcon = lazy(() => import("./EimsbuettelIcon"));
const NordIcon = lazy(() => import("./NordIcon"));
const MitteIcon = lazy(() => import("./MitteIcon"));
const BergedorfIcon = lazy(() => import("./BergedorfIcon"));
const HamburgIcon = lazy(() => import("./HamburgIcon"));
const HamburgFilledIcon = lazy(() => import("./HamburgFilledIcon"));

export default function BezirkIcon({
  color = "#33404D",
  size = "100%",
  bezirk,
}: {
  color?: string;
  size?: string;
  bezirk: string;
}) {
  const bezirkLower = bezirk.toLowerCase();
  if (bezirkLower === "altona") return <AltonaIcon color={color} size={size} />;
  if (bezirkLower === "harburg")
    return <HarburgIcon color={color} size={size} />;
  if (bezirkLower === "wandsbek")
    return <WandsbekIcon color={color} size={size} />;
  if (bezirkLower === "eimsbüttel")
    return <EimsbuettelIcon color={color} size={size} />;
  if (bezirkLower === "eimsbuettel")
    return <EimsbuettelIcon color={color} size={size} />;
  if (bezirkLower === "hamburg-nord")
    return <NordIcon color={color} size={size} />;
  if (bezirkLower === "hamburg-mitte")
    return <MitteIcon color={color} size={size} />;
  if (bezirkLower === "bergedorf")
    return <BergedorfIcon color={color} size={size} />;
  if (bezirkLower === "ausserhalb hamburg")
    return <HamburgIcon color={color} size={size} />;
  if (bezirkLower === "außerhalb hamburg")
    return <HamburgIcon color={color} size={size} />;
  if (bezirkLower === "umland hamburg")
    return <HamburgFilledIcon color={color} size={size} />;
  if (bezirkLower === "hamburg")
    return <HamburgFilledIcon color={color} size={size} />;
}
