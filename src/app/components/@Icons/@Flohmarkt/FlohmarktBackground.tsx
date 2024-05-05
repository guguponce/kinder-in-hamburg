import React from "react";
import BallIcon from "./BallIcon";
import CubesIcon from "./CubesIcon";
import GiraffeIcon from "./GiraffeIcon";
import KlavierIcon from "./KlavierIcon";
import PuzzleIcon from "./PuzzleIcon";
import TShirtIcon from "./TShirtsIcon";
import RasselIcon from "./RasselIcon";
import SchaufelIcon from "./SchaufelIcon";
import EnteIcon from "./EnteIcon";

export default function FlohmarktBackground() {
  const sortedIcons = [
    BallIcon,
    CubesIcon,
    GiraffeIcon,
    KlavierIcon,
    PuzzleIcon,
    TShirtIcon,
    RasselIcon,
    SchaufelIcon,
    EnteIcon,
  ].sort(() => 0.5 - Math.random());
  const colors = ["#73A9BF", "#0B3225", "#3D0C0A"];

  return (
    <div className="absolute w-full h-full flex justify-center items-center flex-wrap gap-2 opacity-20 overflow-hidden">
      {sortedIcons.map((Icon, i) => (
        <div key={i} className={`w-1/4 h-1/4`}>
          <Icon key={i} size="100%" color={colors[i % 3]} />
        </div>
      ))}
    </div>
  );
}
