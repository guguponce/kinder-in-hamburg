import { getThisWeekEvents } from "@app/api/dbActions";
import { iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import WeitereFlohmaerkte from "@components/WeitereEvents";
import RecommendationsMap from "@components/@Map/RecommendationsMap";

export default async function FlohmarktPageMapContainer({
  currentTarget,
  spielplaetzeAround,
  mapClassName,
}: {
  currentTarget: iFlohmarkt | iSpielplatz | iPost;
  spielplaetzeAround?: iSpielplatz[];
  mapClassName?: string;
}) {
  const thisWeekFlohmaerkte = (await getThisWeekEvents()) || [];
  const weitereFlohmaerkte = thisWeekFlohmaerkte.filter(
    ({ id }) => id !== currentTarget.id
  );

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[600px] md:max-w-[800px] rounded p-1 xs:p-2">
      <RecommendationsMap
        containerClassName={mapClassName}
        bezirk={currentTarget.bezirk}
        currentType="flohmarkt"
        stadtteil={currentTarget.stadtteil}
        id={currentTarget.id}
        maxDistance={1000}
        recommendationsList={{
          flohmaerkte: thisWeekFlohmaerkte,
          spielplaetze: spielplaetzeAround,
        }}
      />

      {weitereFlohmaerkte.length > 0 && (
        <>
          <hr className="w-full border-t border-hh-800 mt-4" />
          <section className="w-full max-w-[800px] flex flex-col gap-2 items-center my-4 px-1 xs:px-4 sm:px-8">
            <h3 className="font-bold text-2xl text-hh-800">
              Weitere Märkte dieser Woche:
            </h3>
            <WeitereFlohmaerkte
              type="Flohmärkte"
              displayedMarkers={weitereFlohmaerkte}
              boxStyle="bg-gradient-to-b from-hh-400 to-hh-100 bg-transparent"
            />
          </section>
        </>
      )}
    </div>
  );
}
