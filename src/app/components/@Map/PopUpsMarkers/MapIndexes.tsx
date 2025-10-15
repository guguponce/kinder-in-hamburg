import WeihnachtsmannIcon from "@app/components/@Icons/@Events/WeihnachtsmannIcon";
import WeihnachtsmarktIcon from "@app/components/@Icons/@Events/WeihnachtsmarktIcon";
import StandortIcon from "@app/components/@Icons/StandortIcon";
import { iEventType } from "@app/utils/types";

const MarkerIndexBox = ({ children }: { children: React.ReactNode }) => (
  <div className="w-fit max-w-full flex rounded py-1 px-2 outline outline-1 outline-hh-800">
    <div className="flex justify-center items-center">{children}</div>
  </div>
);
export const MapIndexes = ({ eventTypes }: { eventTypes: iEventType[] }) => {
  console.log("mapindexes", eventTypes);
  if (!eventTypes?.length) return null;
  return (
    <>
      {!!eventTypes?.length && (
        <div className="flex flex-wrap gap-1 px-1 ml-auto justify-center items-center font-semibold">
          {eventTypes.includes("laterne") && (
            <MarkerIndexBox>
              <div className="laterneIcon w-4 h-4 bg-slate-400" />
              <p>Laternenumzug</p>
            </MarkerIndexBox>
          )}
          {eventTypes.includes("laternewerkstatt") && (
            <MarkerIndexBox>
              <div className="laternewerkstattIcon w-4 h-4 bg-slate-400" />
              <p>Laternewerkstatt</p>
            </MarkerIndexBox>
          )}
          {eventTypes.includes("weihnachtsmarkt") && (
            <MarkerIndexBox>
              <WeihnachtsmarktIcon />
              <p>Weihnachtsmarkt</p>
            </MarkerIndexBox>
          )}

          {eventTypes.includes("adventsevent") && (
            <MarkerIndexBox>
              <WeihnachtsmannIcon />
              <p>Adventsprogramm</p>
            </MarkerIndexBox>
          )}
          {eventTypes.includes("flohmarkt") && (
            <MarkerIndexBox>
              <StandortIcon size="1rem" color="#7B3E5E" />
              <p>Flohmärkte</p>
            </MarkerIndexBox>
          )}
          <MarkerIndexBox>
            <StandortIcon size="1rem" color="#343b3e" stroke="#fff" />
            <p>Kommende Events</p>
          </MarkerIndexBox>
        </div>
      )}
    </>
  );
};
