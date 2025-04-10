import { divIcon } from "leaflet";
import { createUserMapIcon } from "./functions";

export const UserLocationIcon = divIcon({
  html: createUserMapIcon(undefined, 25),
  className: "bg-transparent",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});
