"use client";
import GeneralMap from "@app/components/@Map/GeneralMap";
import PostPopUP from "@app/components/@Map/PopUpsMarkers/PostPopUP";
import { createStandortMapIcon, joinAddress } from "@app/utils/functions";
import { iPost, iSpielplatz } from "@app/utils/types";
import { Marker } from "react-leaflet";
import React, { memo } from "react";
import SpielplatzPopUP from "@app/components/@Map/PopUpsMarkers/SpielplatzPopUP";
import { divIcon } from "leaflet";

const badeseenColor = "#4b6ebe";
const freibaederColor = "#4b98be";
const planschbeckenColor = "#4bbe98";
const wasserspieleColor = "#5e782bc9";

const ToggleButton = ({
  title,
  show,
  color,
  onClick,
}: {
  title: string;
  show: boolean;
  color: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded p-2 font-semibold text-sm bg-hh-100 shadow-md ${
        !show && "opacity-50 shadow-none"
      }`}
      style={{ color }}
    >
      {title}
    </button>
  );
};
const MemoToggleButton = memo(ToggleButton);

const createNormalSizeIcon = (color: string, size: number = 30) =>
  divIcon({
    html: createStandortMapIcon(color, size),
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    className: "bg-transparent",
  });

const PostMarkers = ({ posts, color }: { posts: iPost[]; color: string }) => {
  const icon = createNormalSizeIcon(color);
  return (
    <>
      {posts
        .filter(({ lat, lon, address }) => !!lat && !!lon && !!address)
        .map(({ lon, lat, address, id, title, categories, image }) => (
          <Marker icon={icon} key={id} position={[lat!, lon!]}>
            <PostPopUP
              image={image && image[0]}
              address={address!}
              categories={categories}
              title={title}
              id={id}
            />
          </Marker>
        ))}
    </>
  );
};

const SpielplatzMarkers = ({
  spielplaetze,
  color,
}: {
  spielplaetze: iSpielplatz[];
  color: string;
}) => {
  const icon = createNormalSizeIcon(color);
  return (
    <>
      {spielplaetze
        .filter(({ address }) => !!address)
        .map(({ lon, lat, address, id, title, type, spielgeraete }) => (
          <Marker key={id} position={[lat!, lon!]} icon={icon}>
            <SpielplatzPopUP
              address={joinAddress(address!)}
              title={title}
              id={id}
              spielgeraete={spielgeraete || []}
              type={type}
            />
          </Marker>
        ))}
    </>
  );
};

interface iWaterMapContainer {
  freibaeder: iPost[];
  badeseen: iPost[];
  planschbecken: iSpielplatz[];
  wasserspiele: iSpielplatz[];
  children?: React.ReactNode;
}

export default function WaterMapContainer({
  freibaeder,
  badeseen,
  planschbecken,
  wasserspiele,
  children,
}: iWaterMapContainer) {
  const [showBadeseen, setShowBadeseen] = React.useState(true);
  const [showFreibaeder, setShowFreibaeder] = React.useState(true);
  const [showPlanschbecken, setShowPlanschbecken] = React.useState(true);
  const [showWasserspiele, setShowWasserspiele] = React.useState(false);
  return (
    <section className="w-full flex flex-col lg:flex-row items-center gap-2 p-2 my-2 bg-hh-900 bg-opacity-5 rounded-sm">
      {children && (
        <div className="flex lg:hidden flex-col gap-2 items-center justify-center">
          {children}
        </div>
      )}
      <article className="w-full max-w-[750px] h-[60vh]">
        <GeneralMap>
          <>
            {showBadeseen && (
              <PostMarkers posts={badeseen} color={badeseenColor} />
            )}
            {showFreibaeder && (
              <PostMarkers posts={freibaeder} color={freibaederColor} />
            )}
            {showPlanschbecken && (
              <SpielplatzMarkers
                spielplaetze={planschbecken}
                color={planschbeckenColor}
              />
            )}
            {showWasserspiele && (
              <SpielplatzMarkers
                spielplaetze={wasserspiele}
                color={wasserspieleColor}
              />
            )}
          </>
        </GeneralMap>
      </article>
      <aside className="lg:flex-grow flex flex-row flex-wrap justify-center lg:flex-col gap-2">
        {children && (
          <div className="hidden lg:flex flex-col gap-2 items-center justify-center">
            {children}
          </div>
        )}
        {!!badeseen.length && (
          <MemoToggleButton
            title="Badeseen"
            show={showBadeseen}
            color={badeseenColor}
            onClick={() => setShowBadeseen(!showBadeseen)}
          />
        )}
        {!!freibaeder.length && (
          <MemoToggleButton
            title="Freibäder"
            show={showFreibaeder}
            color={freibaederColor}
            onClick={() => setShowFreibaeder(!showFreibaeder)}
          />
        )}
        {!!planschbecken.length && (
          <MemoToggleButton
            title="Planschbecken"
            show={showPlanschbecken}
            color={planschbeckenColor}
            onClick={() => setShowPlanschbecken(!showPlanschbecken)}
          />
        )}
        {!!wasserspiele.length && (
          <MemoToggleButton
            title="Spielpätze mit Wasserspielen"
            show={showWasserspiele}
            color={wasserspieleColor}
            onClick={() => setShowWasserspiele(!showWasserspiele)}
          />
        )}
      </aside>
    </section>
  );
}
