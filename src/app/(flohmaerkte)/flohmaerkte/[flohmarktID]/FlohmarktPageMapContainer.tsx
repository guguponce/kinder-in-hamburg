import { getThisWeekFlohmaerkte } from "@app/api/dbActions";
import { getTodayNexMonday, haversineDistance } from "@app/utils/functions";
import { iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import dynamic from "next/dynamic";
import { getSpielplatzFromBezirkStadtteil } from "@app/api/spActions";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import WeitereFlohmaerkte from "@components/WeitereFlohmaerkte";

const DynamicThisWeekNearbyMap = dynamic(
  () => import("@components/@Map/DynamicThisWeekNearbyMap"),
  {
    ssr: false,
    loading: () => (
      <article className="w-full max-w-[800px] h-[600px]">
        <img
          src="/assets/bezirke/hamburg.webp"
          alt="Hamburg"
          className="w-full h-full object-cover"
        />
      </article>
    ),
  }
);

export default async function MapContainer({
  currentTarget,
}: {
  currentTarget: iFlohmarkt | iSpielplatz | iPost;
}) {
  const { today, nextMonday } = getTodayNexMonday();
  const thisWeekFlohmaerkte = await getThisWeekFlohmaerkte();
  const spielplaetzeNearby =
    (await getSpielplatzFromBezirkStadtteil(
      currentTarget.bezirk!,
      PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[currentTarget.bezirk!] || [
        currentTarget.stadtteil,
      ]
    )) || [];
  if (!thisWeekFlohmaerkte) return null;
  const weitereFlohmaerkte = thisWeekFlohmaerkte
    .filter(({ id }) => id !== currentTarget.id)
    .sort((a, b) => {
      if (!a.lat || !b.lon || !a.lon || !b.lat) return 0;
      const distanceA = haversineDistance(
        a.lat,
        a.lon,
        currentTarget.lat!,
        currentTarget.lon!
      );
      const distanceB = haversineDistance(
        b.lat,
        b.lon,
        currentTarget.lat!,
        currentTarget.lon!
      );
      return distanceA - distanceB;
    });

  const spielplaetzeOneKM = spielplaetzeNearby.filter(
    ({ id, lat, lon }) =>
      haversineDistance(lat, lon, currentTarget.lat!, currentTarget.lon!) <
        2000 && id !== currentTarget.id
  );
  if (!weitereFlohmaerkte.length && !spielplaetzeOneKM.length) return null;
  const todayDisplay = new Date(today)
    .toLocaleDateString("de-DE")
    .split(".")
    .slice(0, 2)
    .join(".");
  const nextMondayDisplay = new Date(nextMonday - 1000 * 60 * 60 * 12)
    .toLocaleDateString("de-DE")
    .split(".")
    .slice(0, 2)
    .join(".");
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[600px] md:max-w-[800px] rounded p-2">
      <DynamicThisWeekNearbyMap
        greenBG={false}
        currentTarget={currentTarget}
        todayDisplay={todayDisplay}
        nextMondayDisplay={nextMondayDisplay}
        spielplaetzeOneKM={spielplaetzeOneKM}
        weitereFlohmaerkte={weitereFlohmaerkte}
      />
      <hr className="w-full border-t border-hh-800 mt-4" />
      {weitereFlohmaerkte.length > 0 && (
        <section className="w-full max-w-[800px] flex flex-col gap-2 items-center my-4 px-1 xs:px-4 sm:px-8">
          <h3 className="font-bold text-2xl text-hh-800">
            Weitere Märkte diese Woche:
          </h3>
          <WeitereFlohmaerkte displayedMarkers={weitereFlohmaerkte} />
        </section>
      )}
    </div>
  );
}
