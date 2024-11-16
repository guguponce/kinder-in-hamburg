import type {
  Hour,
  TypeAndText,
  categoryName,
  iAddress,
  iAusruestung,
  iContributor,
  iFlohmarkt,
  iLatLonResult,
  iPost,
  iSPType,
  iSessionUser,
  iSpielgeräte,
  iSpielplatz,
  iStringifiedContributor,
  iStringifiedFlohmarkt,
  iStringifiedRetrievedPost,
  iStringifiedSpielplatz,
  iForecastHourly,
} from "./types";
import {
  ausruestungList,
  bezirke,
  categoryNames,
  mappingSpielgeraete,
  spType,
  spielgeraeteList,
} from "./constants";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export const postDate = () => new Date().getTime();

export const getImagesArray = (images: string) => {
  return images.replace("[", "").replace("]", "").split(",");
};

export const parsePost = (post: iStringifiedRetrievedPost): iPost => {
  return {
    status: post.status || "pending",
    user_id: post.user_id,
    title: post.title,
    text: post.text ? JSON.parse(post.text) : undefined,
    tags: post.tags ? JSON.parse(post.tags) : undefined,
    pinnedPost: !!post.pinnedPost,
    minAge: post.minAge,
    maxAge: post.maxAge || undefined,
    link: post.link,
    lastUpdate: post.lastUpdate || undefined,
    image: post.image ? JSON.parse(post.image) : undefined,
    igAccounts: post.igAccounts ? JSON.parse(post.igAccounts) : undefined,
    categories: post.categories ? JSON.parse(post.categories) : [],
    address: post.address
      ? post.address[0] !== "{"
        ? post.address
        : JSON.parse(post.address)
      : undefined,
    lat: post.lat,
    lon: post.lon,
    addedBy: post.addedBy ? JSON.parse(post.addedBy) : undefined,
    id: post.id,
    createdAt: post.createdAt,
    bezirk: post.bezirk,
    stadtteil: post.stadtteil,
  };
};
export const parseContributor = (contributor: iStringifiedContributor) => {
  return {
    ...contributor,
    flohmaerkteSubmitted: JSON.parse(contributor.postsSubmitted) as
      | number[]
      | null,
    postsSubmitted: JSON.parse(contributor.postsSubmitted) as number[] | null,
    spielplaetzeSubmitted: JSON.parse(contributor.postsSubmitted) as
      | number[]
      | null,
  } as iContributor;
};
export const parseAllPosts = (posts: iStringifiedRetrievedPost[]) =>
  posts.map((p) => parsePost(p));

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const parseAddress = (address: string | iAddress) => {
  if (typeof address === "object") return address;
  const parts = address.split(",").map((part) => part.trim());
  const streetParts = parts[0].split(/\s+/);
  const number = streetParts.pop();
  const street = streetParts.join(" ");
  const [PLZ, city] = parts[1].split(/\s+/);

  // Construct and return the address object
  return {
    street,
    number,
    PLZ,
    city,
  };
};

export const filterExtraImages = (images: File[], maxBundleSize = 5000000) => {
  const maxSize = maxBundleSize;
  let maxIndex = 0;
  let lastSize = 0;
  for (let i = 0; i < images.length; i++) {
    const element = images[i];
    if (lastSize + element.size > maxSize) {
      break;
    } else {
      maxIndex = i;
    }
  }
  return images.slice(0, maxIndex + 1);
};

export const getDescription = (text: string) => {
  const splittedText = text.split(" ");
  return text.length > 10
    ? text.split(" ").slice(0, 10).join(" ") + "..."
    : splittedText.join(" ");
};

export const getPlainText = (text: TypeAndText[], max?: number) => {
  const textArray = text.map(([_, val]) => val);
  const plainText = textArray.slice(0, max || textArray.length).join(" ");

  return max && max > textArray.length ? plainText + "..." : plainText;
};

export const parseParams = (params: string) => {
  return decodeURIComponent(params) as string | categoryName;
};

export function separateAddress(address: string) {
  const regex = /^(.*?)(\d+.*|\s+),\s*(\d+|\s+)\s*(.*?|\s+)$/;
  const match = address.match(regex);
  if (!match) {
    return { street: "", number: "", PLZ: "", city: "" };
  }
  const [, street, number, PLZ, city] = match;
  return {
    street: street.trim(),
    number: number.trim(),
    PLZ: PLZ.trim(),
    city: city.trim(),
  };
}

export function joinAddress({ street, number, PLZ, city }: iAddress) {
  let parsedAddress = "";
  let streetnumber = "";
  if (street) {
    streetnumber += street;
  }
  if (number) {
    streetnumber += " " + number;
  }
  parsedAddress += streetnumber;
  if (PLZ || city) {
    parsedAddress += ", ";
  }
  if (PLZ) {
    parsedAddress += PLZ;
    if (city) {
      parsedAddress += " ";
    }
  }
  if (city) {
    parsedAddress += city;
  }
  return parsedAddress;
}

export const getAddressQuery = ({ street, number, PLZ, city }: iAddress) =>
  `${street || ""}+${number || ""}+${PLZ || ""}+${city || ""}`;

export const parseFlohmarkt = (flohmarkt: iStringifiedFlohmarkt) => {
  return {
    ...flohmarkt,
    addedBy: JSON.parse(flohmarkt.addedBy) as iSessionUser,
    closedDates: flohmarkt.closedDates
      ? (JSON.parse(flohmarkt.closedDates) as number[])
      : undefined,
  } as iFlohmarkt;
};

export const parseAllFlohmaerkte = (flohmaerkte: iStringifiedFlohmarkt[]) =>
  flohmaerkte.map((f) => parseFlohmarkt(f));

export const checkBezirk = (bezirk: string) => {
  const bezirkRegex = new RegExp(bezirk, "i");
  const parsedBezirk = bezirke.find((b) => {
    return bezirkRegex.test(b);
  });
  return !!parsedBezirk;
};

export const checkCategory = (category: string) => {
  const categoryRegex = new RegExp(category, "i");
  const parsedCategory = categoryNames.find((c) => {
    return categoryRegex.test(c);
  });
  return !!parsedCategory;
};

export const getDate = (date: number) =>
  new Date(date).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
  });

export function addressWithoutCity(address: string) {
  const match = address.match(/\b\d{5}\b/);
  if (match && match.index) {
    let plzIndex = match.index;
    let newAddress = address.slice(0, plzIndex + 5).trim();
    return newAddress;
  } else {
    return address;
  }
}

export const getStartTime = (time: string | undefined) =>
  time?.split("-")[0].trim();
export const getEndTime = (time: string | undefined) =>
  time?.split("-")[1]?.trim();
export const joinTime = (start: string | undefined, end: string | undefined) =>
  !start ? undefined : !end ? start : `${start} - ${end}`;

export const getTodayNexMonday = () => {
  const nowUTCDate = new Date();
  const currentDate = new Date(nowUTCDate.getTime() + 2 * 60 * 60 * 1000);
  const currentDayOfWeek = currentDate.getDay();
  const daysUntilNextMonday = (1 - currentDayOfWeek + 7) % 7;
  const millisecondsUntilNextMonday =
    (daysUntilNextMonday || 7) * 24 * 60 * 60 * 1000;
  const nextMonday = new Date(
    currentDate.getTime() + millisecondsUntilNextMonday
  );
  nextMonday.setUTCHours(0, 0, 0, 1);
  currentDate.setUTCHours(0, 0, 0, 1);
  return {
    today: currentDate.getTime(),
    nextMonday:
      currentDate.getDay() === 0
        ? currentDate.getTime() + 1000 * 60 * 60 * 24
        : nextMonday.getTime(),
  };
};

export const getCurrentTime = () => {
  const germanyDate = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Berlin",
  });
  return new Date(germanyDate);
};
export const whenWillRainLater = (hours: iForecastHourly[]) => {
  return hours.findIndex(
    ({ HasPrecipitation, Hour }) => Hour > 6 && Hour < 21 && HasPrecipitation
  );
};

export const getTimeRainAndActivity = (
  hours: iForecastHourly[],
  activity: "Outdoor" | "Indoor" | "Both"
) => {
  const currentTime = getCurrentTime();
  const currentHour = getCurrentTime().getHours();
  const nextRain = whenWillRainLater(hours);
  const sunsetIndex = hours.find((h) => h.IsDaylight)?.Hour || 19;

  const activityType =
    nextRain !== -1 && nextRain + 1 + currentHour < sunsetIndex
      ? "Indoor"
      : activity === "Both"
        ? ["Indoor", "Outdoor"][Math.floor(Math.random() * 2)]
        : activity;
  return { currentTime, currentHour, nextRain, activityType, sunsetIndex };
};

export const separateByDate = (events: iFlohmarkt[]) => {
  return events.reduce(
    (acc, flohmarkt) => {
      const date = getDate(flohmarkt.date);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(flohmarkt);
      return acc;
    },
    {} as Record<string, iFlohmarkt[]>
  );
};

export function replaceEventTypes(types: string[]) {
  const replacements: { [key: string]: string } = {
    flohmarkt: "Flohmärkte",
    laterne: "Laternenumzüge",
    laternewerkstatt: "Laternebasteln",
    weihnachtsmarkt: "Weihnachtsmärkte",
  };

  return types.map((type) => replacements[type] || type);
}
export const sortPostsByDate = (posts: iPost[]) =>
  [...posts].sort((a, b) => b.createdAt - a.createdAt);

export const separateByStatus = <T extends iFlohmarkt | iPost | iSpielplatz>(
  array: T[]
) => {
  return array.reduce(
    (acc, current) => {
      const { status } = current;
      if (!status) {
        acc["pending"].unshift(current);
      } else {
        status === "pending"
          ? acc["pending"].unshift(current)
          : acc[status].push(current);
      }
      return acc;
    },
    {
      approved: [] as T[],
      pending: [] as T[],
      rejected: [] as T[],
      old: [] as T[],
    }
  );
};

export function distanceFilter<T extends iSpielplatz | iFlohmarkt | iPost>(
  list: T[],
  currentSP: T,
  maxDistance: number
) {
  if (!currentSP || !currentSP.lat || !currentSP.lon) return list;
  const { lat, lon } = currentSP;
  return list
    .map((sp) => {
      if (!sp.lat || !sp.lon) return sp;
      const distance = haversineDistance(lat, lon, sp.lat, sp.lon);
      return distance < maxDistance && distance > 0 ? { sp, distance } : null;
    })
    .filter((sp) => !!sp);
}

export const getLatLong = async (address: string) => {
  try {
    const addressQuery = address.match(/[a-zA-ZßäüöÄÜÖ]+|\d+/g)!.join("+");
    const url = `https://nominatim.openstreetmap.org/search?q=${addressQuery}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    return (data[0] as iLatLonResult) || { lat: "0", lon: "0" };
  } catch (e) {
    console.error(e);
    return { lat: "0", lon: "0" };
  }
};

export const addLatLongToPost = async (post: iPost) => {
  if (post.lat && post.lon) return post;
  if (!post.address) return false;

  const addressQuery = getAddressQuery(post.address);
  const { lat, lon } = await getLatLong(addressQuery);

  return {
    ...post,
    lat: parseFloat(lat),
    lon: parseFloat(lon),
  };
};

export const getAllLatLong = async (posts: iPost[]) => {
  return Promise.all(
    posts.map((post) =>
      getLatLong(post.address ? joinAddress(post.address) : "")
    )
  );
};

export const parseSpielplatz = (spielplatz: iStringifiedSpielplatz) => {
  return {
    ...spielplatz,
    addedBy: JSON.parse(spielplatz.addedBy) as iSessionUser,
    address: spielplatz.address
      ? (JSON.parse(spielplatz.address) as iAddress)
      : undefined,
    tags: spielplatz.tags
      ? (JSON.parse(spielplatz.tags) as string[])
      : undefined,
    image: spielplatz.image
      ? (JSON.parse(spielplatz.image) as string[])
      : undefined,
    type: spielplatz.type ? (JSON.parse(spielplatz.type) as string[]) : [],
    spielgeraete: spielplatz.spielgeraete
      ? (JSON.parse(spielplatz.spielgeraete) as string[])
      : [],
    ausruestung: spielplatz.ausruestung
      ? (JSON.parse(spielplatz.ausruestung) as string[])
      : [],
  } as iSpielplatz;
};

export const parseSpielgeräte = (spArray: string[] | undefined) => {
  if (!spArray) return [];
  const resultArray = spArray
    .map((item) => {
      const lowerCaseItem = item.toLowerCase();
      if (spielgeraeteList.includes(lowerCaseItem)) {
        return lowerCaseItem;
      }
      return mappingSpielgeraete[lowerCaseItem] || null;
    })
    .filter((item) => !!item) as iSpielgeräte[];

  return Array.from(new Set(resultArray));
};

export const parsedAuruestung = (aArray: string[] | undefined) => {
  if (!aArray) return [];
  return aArray
    .map((item) => {
      const lowerCaseItem = item.toLowerCase();
      if (ausruestungList.includes(lowerCaseItem)) {
        return lowerCaseItem;
      }
      return null;
    })
    .filter((item) => !!item) as iAusruestung[];
};

export const parsedSPType = (type: string[] | undefined) => {
  if (!type) return [];
  return type
    .map((item) => {
      const lowerCaseItem = item.toLowerCase();
      if (spType.includes(lowerCaseItem)) {
        return lowerCaseItem;
      }
      return null;
    })
    .filter((item) => !!item) as iSPType[];
};

const datePattern = /(\d{1,2})\.(\d{1,2})\./g;

export const extractDates = (str: string) => {
  let match = datePattern.exec(str);
  if (!match) return null;

  return {
    day: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
    planschi: [
      "schlump",
      "weberspark",
      "wehberspark",
      "wehbers park",
      "weiher",
    ].filter((p) => str.includes(p)),
  };
};

export const isToday = (date: {
  day: number;
  month: number;
  planschi: string[];
}) => {
  const today = new Date();
  return date.day === today.getDate() && date.month === today.getMonth() + 1;
};

export const getFirstDate = (strings: string[]) => {
  for (let i = 0; i < strings.length; i++) {
    const date = extractDates(strings[i]);
    if (date) return date;
  }
  return null;
};

export function isTypeSpielplatz(item: any): item is iSpielplatz {
  return "spielgeraete" in item;
}
export function isTypeFlohmarkt(item: any): item is iFlohmarkt {
  return "date" in item;
}
export function isTypePost(item: any): item is iPost {
  return "categories" in item;
}
export function isTypeEvent(item: any): item is iFlohmarkt {
  return "type" in item;
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRadians = (degree: number) => degree * (Math.PI / 180);

  const R = 6371000; // Radius of the Earth in meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function createStandortMapIcon(
  color: string = "#39579D",
  size: number = 30
) {
  return `<svg fill=${color} height="${size}" width="${size}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.953 511.953" stroke="#F6AA1C"><g id="SVGRepo_iconCarrier"> <g transform="translate(-1)"> <g> <g> <path d="M256.995,149.287c-11.776,0-21.333,9.579-21.333,21.333c0,11.755,9.557,21.333,21.333,21.333s21.333-9.579,21.333-21.333 C278.328,158.865,268.771,149.287,256.995,149.287z"/> <path d="M365.518,38.887C325.987,6.311,274.04-6.639,223.011,3.239C154.147,16.615,100.152,72.273,88.718,141.735 c-6.784,41.003,0.725,81.216,21.696,116.267l8.704,14.528c27.861,46.443,56.64,94.485,79.701,143.893l38.848,83.221 c3.499,7.509,11.029,12.309,19.328,12.309s15.829-4.8,19.328-12.309l34.965-74.923c23.317-49.984,52.096-98.688,79.957-145.792 l12.971-22.016c15.339-26.091,23.445-55.936,23.445-86.293C427.662,119.484,405.006,71.463,365.518,38.887z M256.995,234.62 c-35.285,0-64-28.715-64-64s28.715-64,64-64s64,28.715,64,64S292.28,234.62,256.995,234.62z"/> </g> </g> </g> </g></svg>`;
}

export const separateInBezirke = <T extends iSpielplatz | iFlohmarkt | iPost>(
  array: Array<T>
) =>
  array.reduce(
    (acc, sp) => {
      const { bezirk } = sp;
      if (!acc[bezirk]) acc[bezirk] = [sp];
      else acc[bezirk].push(sp);
      return acc;
    },
    {} as { [key: string]: T[] }
  );

interface iLists {
  flohmaerkte?: iFlohmarkt[];
  posts?: iPost[];
  spielplaetze?: iSpielplatz[];
}
export const filterByDistance = (
  lat: number,
  lon: number,
  lists: iLists,
  maxDistance: number
) => {
  const resultList = {} as iLists;
  Object.entries(lists).map(([key, list]) => {
    if (!list) return;

    const filteredList = (
      list as iPost[] | iSpielplatz[] | iFlohmarkt[]
    ).filter((item) => {
      if (item.lat && item.lon) {
        const distance = haversineDistance(lat, lon, item.lat, item.lon);
        return distance <= maxDistance;
      }
      return false;
    });
    if (key === "flohmaerkte") resultList[key] = filteredList as iFlohmarkt[];
    if (key === "posts") resultList[key] = filteredList as iPost[];
    if (key === "spielplaetze") resultList[key] = filteredList as iSpielplatz[];
  });
  return resultList;
};

export function removeCopyrightLine(text: string) {
  if (!text.includes("©")) return text;
  return text.split("\n").slice(1).join("\n").trim();
}

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}
