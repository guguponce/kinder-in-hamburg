"use server";
import { addSpielplatz, updateSpielplatz } from "@app/api/spActions";
import { getLatLong } from "@app/utils/functions";
import { iSpielplatz } from "@app/utils/types";
import { FieldValues } from "react-hook-form";

export const submitNewSpielplatz = async (
  data: FieldValues,
  spielgaereteList: string[],
  ausruestungList: string[],
  typeList: string[],
  newID: number,
  images: string[]
) => {
  const latlon = await getLatLong(
    [data.street, data.number, data.PLZ, data.city].join(" ")
  );
  if (!latlon.lat || !latlon.lon)
    return alert("Could not find the location of the Spielplatz");
  const minAge = data.minAge ? parseInt(data.minAge) : undefined;
  const maxAge = data.maxAge ? parseInt(data.maxAge) : undefined;
  const suggestedSpielplatz: iSpielplatz = {
    id: data.id,
    status: data.status,
    createdAt: data.createdAt || newID,
    title: data.title,
    addedBy: data.addedBy,
    bezirk: data.bezirk,
    stadtteil: data.stadtteil,
    address: {
      street: data.street,
      number: data.number,
      PLZ: data.PLZ,
      city: data.city,
    },
    lat: data.lat || parseFloat(latlon.lat),
    lon: data.lon || parseFloat(latlon.lon),
    text: data.text,
    pinnedSpielplatz: data.pinnedSpielplatz,
    type: typeList,
    ausruestung: ausruestungList,
    spielgeraete: spielgaereteList,
    minAge: minAge && maxAge ? (minAge > maxAge ? minAge : maxAge) : minAge,
    maxAge: maxAge,
    tags: data.tags.split("*").map((tag: string) => tag.trim()),
    image: images,
  };
  return await addSpielplatz(suggestedSpielplatz);
};

export const submitUpdateSpielplatz = async (
  data: FieldValues,
  spielgaereteList: string[],
  ausruestungList: string[],
  typeList: string[],
  images: string[]
) => {
  const latlon = await getLatLong(
    [data.street, data.number, data.PLZ, data.city].join(" ")
  );
  if (!latlon.lat || !latlon.lon)
    return alert("Could not find the location of the Spielplatz");
  const minAge = data.minAge ? parseInt(data.minAge) : undefined;
  const maxAge = data.maxAge ? parseInt(data.maxAge) : undefined;
  const suggestedSpielplatz: iSpielplatz = {
    id: data.id,
    status: data.status,
    createdAt: data.createdAt,
    title: data.title,
    addedBy: data.addedBy,
    bezirk: data.bezirk,
    stadtteil: data.stadtteil,
    address: {
      street: data.street,
      number: data.number,
      PLZ: data.PLZ,
      city: data.city,
    },
    lat: data.lat || parseFloat(latlon.lat),
    lon: data.lon || parseFloat(latlon.lon),
    text: data.text,
    pinnedSpielplatz: data.pinnedSpielplatz,
    type: typeList,
    ausruestung: ausruestungList,
    spielgeraete: spielgaereteList,
    minAge: minAge && maxAge ? (minAge > maxAge ? minAge : maxAge) : minAge,
    maxAge: maxAge,
    tags: data.tags.split("*").map((tag: string) => tag.trim()),
    image: images,
  };
  return await updateSpielplatz(suggestedSpielplatz);
};
