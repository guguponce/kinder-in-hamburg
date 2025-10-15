import {
  flohmarktIcon,
  futureIcon,
  todayIcon,
  smallWeihnachtsmarktIcon,
  weihnachtsmarktIcon,
  eventIcon,
  futureLaterneIcon,
  futureLaternewerkstattMarkerIcon,
} from "../mapUtils/constants";
import { Marker } from "react-leaflet";
import { iBezirk, iEventType, iFlohmarkt } from "@app/utils/types";
import React from "react";
import { getDate } from "@app/utils/functions";
import { laterneIcon } from "@app/components/@Map/PopUpsMarkers/LaterneMarker";
import { laternewerkstattMarkerIcon } from "@app/components/@Map/PopUpsMarkers/LaternewerkstattMarker";
import FlohmarktPopUP from "./FlohmarktPopUP";

export const DisplayedMarkers = ({
  eventsList,
  selectedBezirk,
  selectedEvent,
  todayString,
  nextMonday,
}: {
  todayString: string;
  nextMonday: number;
  eventsList: iFlohmarkt[];
  selectedBezirk: iBezirk | undefined;
  selectedEvent: iEventType | undefined;
}) => {
  return eventsList.map(
    ({ id, lat, lon, address, date, endDate, title, bezirk, type, image }) => {
      return (selectedBezirk && bezirk !== selectedBezirk) ||
        (selectedEvent && selectedEvent !== type) ? null : (
        <React.Fragment key={id}>
          <Marker
            icon={
              type === "weihnachtsmarkt"
                ? selectedEvent === "weihnachtsmarkt"
                  ? weihnachtsmarktIcon
                  : smallWeihnachtsmarktIcon
                : endDate
                  ? todayIcon
                  : getDate(date) === todayString
                    ? todayIcon
                    : type === "laterne"
                      ? date < nextMonday
                        ? laterneIcon
                        : futureLaterneIcon
                      : type === "laternewerkstatt"
                        ? date < nextMonday
                          ? laternewerkstattMarkerIcon
                          : futureLaternewerkstattMarkerIcon
                        : type === "flohmarkt"
                          ? flohmarktIcon
                          : date < nextMonday
                            ? type
                              ? eventIcon
                              : flohmarktIcon
                            : futureIcon
            }
            key={id}
            position={[lat || 53.5511, lon || 9.9937]}
          >
            <FlohmarktPopUP
              id={id}
              address={address}
              date={date}
              title={title}
              type={!type ? "flohmaerkte" : "events"}
              image={image}
            />
          </Marker>
        </React.Fragment>
      );
    }
  );
};
