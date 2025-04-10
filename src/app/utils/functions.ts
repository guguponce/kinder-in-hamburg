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
  iListsFPS,
  iEventType,
} from "./types";
import {
  ausruestungList,
  bezirke,
  categoryNames,
  eventTypesNames,
  mappingSpielgeraete,
  spType,
  spielgeraeteList,
  weekDays,
} from "./constants";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export const postDate = () => Date.now();

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

export const parseDescriptionWithTags = (text: string | undefined) =>
  (text || "").replace(
    /<\/?b>|<\/?sb>|<\/?i>|<\/?u>|<\/?upper>|<\/?link>|<\/?h3>|<\/?h2>/g,
    ""
  );

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

export const getDate = (
  date: number,
  withDay: boolean = false,
  onlyNumbers = false
) => {
  const d = new Date(date);
  const localeDate = d.toLocaleDateString("de-DE", {
    day: onlyNumbers ? "2-digit" : "numeric",
    month: onlyNumbers ? "2-digit" : "long",
  });
  return withDay ? `${weekDays[d.getDay()]} - ${localeDate}` : localeDate;
};
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

  const activityType: "Indoor" | "Outdoor" =
    nextRain !== -1 && nextRain + 1 + currentHour < sunsetIndex
      ? "Indoor"
      : activity === "Both"
        ? (["Indoor", "Outdoor"][Math.floor(Math.random() * 2)] as
            | "Indoor"
            | "Outdoor")
        : activity;
  return { currentTime, currentHour, nextRain, activityType, sunsetIndex };
};

export const separateByDate = (
  events: iFlohmarkt[],
  withDate: boolean = false
) => {
  return events.reduce(
    (acc, flohmarkt) => {
      const date = getDate(flohmarkt.date, withDate);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(flohmarkt);
      return acc;
    },
    {} as Record<string, iFlohmarkt[]>
  );
};

export function replaceEventTypes(types: iEventType[]) {
  return types.map((type) => eventTypesNames[type] || type);
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
  if (!post.address.street || !post.address.PLZ || !post.address.city)
    return "No complete address";
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

export const filterByDistance = (
  lat: number,
  lon: number,
  lists: iListsFPS,
  maxDistance: number
) => {
  const resultList = {} as iListsFPS;
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
    if (key === "events") resultList[key] = filteredList as iFlohmarkt[];
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

async function reduceQualityUnderSpecificKb(
  canvas: HTMLCanvasElement,
  kb: number,
  minQuality: number = 0.5,
  fileName: string
) {
  let finalFile: File | undefined = undefined;
  let url: string | undefined = undefined;
  let quality = 1;
  while (quality > minQuality && !finalFile) {
    const dataUrl = canvas.toDataURL("image/webp", quality);
    const file = new File([dataUrl], fileName + ".webp", {
      type: "image/webp",
    });
    if (file.size < kb * 1000 || quality <= minQuality + 0.05) {
      finalFile = file;
      url = dataUrl;
    }
    quality -= 0.1;
  }
  return { file: finalFile, url };
}

const createBlob = (dataUrl: string, fileName: string) => {
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return new File(
    [blob],
    fileName.slice(0, fileName.lastIndexOf(".")) + ".webp",
    {
      type: "image/webp",
    }
  );
};
export async function convertToWebp(
  file: File,
  maxWidth: number,
  maxFileKb: number,
  fileSetter?: React.Dispatch<React.SetStateAction<File[]>>,
  urlSetter?: React.Dispatch<React.SetStateAction<string[]>>
) {
  const url = URL.createObjectURL(file);

  // If file is already smaller than the max size, no need to convert
  if (file.size < maxFileKb * 1000) {
    if (fileSetter && urlSetter) {
      fileSetter([file]);
      urlSetter([url]);
    }
    return { file, url };
  }

  // Return a Promise to ensure async handling
  return new Promise<{ file: File | undefined; url: string | undefined }>(
    (resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          let newWidth: number;
          let newHeight: number;
          const horizontal = img.width > img.height;
          if (horizontal) {
            newWidth = img.width > maxWidth ? maxWidth : img.width;
            newHeight = newWidth * (img.height / img.width);
          } else {
            newHeight = img.height > maxWidth ? maxWidth : img.height;
            newWidth = newHeight * (img.width / img.height);
          }
          // const newWidth = img.width > maxWidth ? maxWidth : img.width;
          // const newHeight = newWidth * (img.height / img.width);
          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          const newName = file.name.replace(/\s+/g, "_");
          const { url } = await reduceQualityUnderSpecificKb(
            canvas,
            maxFileKb,
            0.5,
            newName
          );

          if (url) {
            const newFile = createBlob(url, newName);
            if (fileSetter && urlSetter) {
              fileSetter([newFile]);
              urlSetter([url]);
            }
            resolve({ file: newFile, url });
          } else {
            reject(new Error("Error generating WebP image"));
          }
        } else {
          reject(new Error("Canvas context not found"));
        }
      };
      img.onerror = reject; // If there's an error loading the image
    }
  );
}
export async function convertAllFilesToWebp(
  filesArr: FileList,
  maxWidth: number,
  maxFileKb: number
) {
  const conversionPromises = Array.from(filesArr).map((file) => {
    return convertToWebp(file, maxWidth, maxFileKb);
  });

  // Wait for all conversions to finish
  const convertedFiles = await Promise.all(conversionPromises);

  // Filter out any null or undefined conversions if necessary
  const { urls, files } = convertedFiles.reduce(
    (acc, converted) => {
      if (converted?.file && converted?.url) {
        acc.urls.push(converted.url);
        acc.files.push(converted.file);
      }
      return acc;
    },
    { urls: [], files: [] } as { urls: string[]; files: File[] }
  );

  // Log after all conversions are done
  return { urls, files };
}

// const reduceSizeSpecificKb = (
//   img: HTMLImageElement,
//   minWidth: number,
//   kb: number
// ) => {
//   let finalFile: File | undefined = undefined;
//   let url: string | undefined = undefined;
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");
//   if (ctx) {
//     ctx.imageSmoothingEnabled = true;
//     ctx.imageSmoothingQuality = "high";
//     let width = img.width;
//     let height = img.height;

//     while (!finalFile && width > minWidth - 100) {
//       if (width - 100 < minWidth) {
//         canvas.width = minWidth;
//         const newHeight = img.height * (minWidth / img.width);
//         canvas.height = newHeight;
//         ctx.drawImage(img, 0, 0, minWidth, newHeight);
//         const dataUrl = canvas.toDataURL("image/webp", 0.7);
//         const file = new File([dataUrl], "image.webp", {
//           type: "image/webp",
//         });
//         finalFile = file;
//         url = dataUrl;
//         return {
//           file,
//           url,
//         };
//       } else {
//         canvas.width = width;
//         const newHeight = height * (width / img.width);
//         canvas.height = newHeight;
//         ctx.drawImage(img, 0, 0, width, newHeight);
//       }
//       const dataUrl = canvas.toDataURL("image/webp", 0.7);
//       const file = new File([dataUrl], "image.webp", {
//         type: "image/webp",
//       });
//       if (file.size < kb * 1000) {
//         finalFile = file;
//         url = dataUrl;
//       }
//       if (width > 2000) {
//         width = 2000;
//       } else {
//         width = width - 100;
//       }
//     }

//     return {
//       file: finalFile,
//       url,
//     };
//   }
// };
