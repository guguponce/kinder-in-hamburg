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
import BootsIcon from "./BootsIcon";

export default function FlohmarktBackground({
  randomNumber = 0.1283778948948,
}: {
  randomNumber?: number;
}) {
  const colors = ["#73A9BF", "#0B3225", "#3D0C0A"];
  const bgColor = colors[Math.floor(randomNumber * 10) % 3];
  return (
    <div
      className={`absolute w-full h-full top-0 flex justify-center items-center flex-wrap gap-2 overflow-hidden bg-[${bgColor}] bg-opacity-50`}
    >
      {randomNumber
        .toFixed(9)
        .slice(2)
        .split("")
        .map((num, i) => (
          <div key={i} className={`w-1/4 h-1/4 opacity-50`}>
            {num === "0" && (
              <BallIcon key={i} size="100%" color={colors[i % 3]} />
            )}
            {num === "1" && (
              <CubesIcon key={i} size="100%" color={colors[i % 3]} />
            )}
            {num === "2" && (
              <GiraffeIcon key={i} size="100%" color={colors[i % 3]} />
            )}
            {num === "3" && (
              <KlavierIcon key={i} size="100%" color={colors[i % 3]} />
            )}
            {num === "4" && (
              <PuzzleIcon key={i} size="100%" color={colors[i % 3]} />
            )}
            {num === "5" && (
              <TShirtIcon key={i} size="100%" color={colors[i % 3]} />
            )}
            {num === "6" && (
              <RasselIcon key={i} size="100%" color={colors[i % 3]} />
            )}
            {num === "7" && (
              <SchaufelIcon key={i} size="100%" color={colors[i % 3]} />
            )}
            {num === "8" && (
              <EnteIcon key={i} size="100%" color={colors[i % 3]} />
            )}
            {num === "9" && (
              <BootsIcon key={i} size="100%" color={colors[i % 3]} />
            )}
          </div>
        ))}
    </div>
  );
}
