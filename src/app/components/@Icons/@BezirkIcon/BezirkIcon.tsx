import React from "react";
import SpielgeraeteIcon from "../@Spielplatz/SpielgeraeteIcon";

export default function BezirkIcon({
  color = "#33404D",
  size = "24px",
  bezirk,
}: {
  color?: string;
  size?: string;
  bezirk: string;
}) {
  const bezirkIcons: { [x: string]: string } = {
    altona: "altonaIcon.svg",
    harburg: "harburgIcon.svg",
    wandsbek: "wandsbekIcon.svg",
    eimsbuettel: "eimsbuettelIcon.svg",
    "hamburg-nord": "nordIcon.svg",
    "hamburg-mitte": "mitteIcon.svg",
    bergedorf: "bergedorfIcon.svg",
    "ausserhalb hamburg": "bezirkeIcon.svg",
    "außerhalb hamburg": "bezirkeIcon.svg",
  };
  return (
    <img
      className={`bezirkIcon w-fit h-full object-contain saturate-0 hover:invert-[0.2] transition-colors`}
      src={"/assets/bezirke/" + bezirkIcons[bezirk.toLocaleLowerCase()]}
      alt=""
    />
  );
}
