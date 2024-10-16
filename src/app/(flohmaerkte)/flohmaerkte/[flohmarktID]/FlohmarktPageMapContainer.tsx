import { getThisWeekFlohmaerkte } from "@app/api/dbActions";
import { iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import WeitereFlohmaerkte from "@components/WeitereFlohmaerkte";
import RecommendationsMap from "@app/components/@Map/RecommendationsMap";

export default async function FlohmarktPageMapContainer({
  currentTarget,
  spielplaetzeAround,
}: {
  currentTarget: iFlohmarkt | iSpielplatz | iPost;
  spielplaetzeAround?: iSpielplatz[];
}) {
  const thisWeekFlohmaerkte = (await getThisWeekFlohmaerkte()) || [];
  const weitereFlohmaerkte = thisWeekFlohmaerkte.filter(
    ({ id }) => id !== currentTarget.id
  );

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[600px] md:max-w-[800px] rounded p-2">
      <RecommendationsMap
        bezirk={currentTarget.bezirk}
        currentType="flohmarkt"
        stadtteil={currentTarget.stadtteil}
        id={currentTarget.id}
        maxDistance={2000}
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
              Weitere Märkte diese Woche:
            </h3>
            <WeitereFlohmaerkte displayedMarkers={weitereFlohmaerkte} />
          </section>
        </>
      )}
    </div>
  );
}
