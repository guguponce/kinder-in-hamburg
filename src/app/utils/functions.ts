import type {
  TypeAndText,
  iAddress,
  iPost,
  iSessionUser,
  iStringifiedFlohmarkt,
  iStringifiedRetrievedPost,
} from "./types";
import { bezirke, categoryNames } from "./constants";

export const postDate = () => new Date().getTime();

export const getImagesArray = (images: string) => {
  return images.replace("[", "").replace("]", "").split(",");
};

export const parsePost = (post: iStringifiedRetrievedPost): iPost => {
  return {
    status: post.status,
    user_id: post.user_id,
    title: post.title,
    text: JSON.parse(post.text),
    tags: JSON.parse(post.tags),
    pinnedPost: !!post.pinnedPost,
    minAge: post.minAge,
    maxAge: post.maxAge || undefined,
    link: post.link,
    lastUpdate: post.lastUpdate || undefined,
    image: JSON.parse(post.image),
    igAccounts: JSON.parse(post.igAccounts),
    id: post.id,
    createdAt: post.createdAt,
    categories: JSON.parse(post.categories),
    bezirk: post.bezirk,
    address: post.address
      ? post.address[0] !== "{"
        ? post.address
        : JSON.parse(post.address)
      : undefined,
    addedBy: JSON.parse(post.addedBy),
  };
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

export const filterExtraImages = (images: File[]) => {
  const maxSize = 3000000;
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

export const getPlainText = (text: TypeAndText[]) =>
  text.map(([_, val]) => val).join(" ");

export const parseParams = (params: string) => {
  let parsed = params.replace("-", " ");
  return decodeURIComponent(parsed);
};

export function separateAddress(address: string) {
  const regex = /^(.*?)(\d+),\s*(\d+)\s*(.*?)$/;
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

export function joinAddress(addressObj: iAddress) {
  let parsedAddress = "";
  if (addressObj.street && addressObj.number) {
    parsedAddress += `${addressObj.street} ${addressObj.number}`;
    if (addressObj.PLZ || addressObj.city) {
      parsedAddress += ", ";
    }
  }
  if (addressObj.PLZ) {
    parsedAddress += addressObj.PLZ;
    if (addressObj.city) {
      parsedAddress += " ";
    }
  }
  if (addressObj.city) {
    parsedAddress += addressObj.city;
  }
  return parsedAddress;
}

export const parseFlohmarkt = (flohmarkt: iStringifiedFlohmarkt) => {
  return {
    ...flohmarkt,
    addedBy: JSON.parse(flohmarkt.addedBy) as iSessionUser,
  };
};

export const parseAllFlohmarkte = (flohmarkte: iStringifiedFlohmarkt[]) =>
  flohmarkte.map((f) => parseFlohmarkt(f));

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
    year: "numeric",
  });

export const getStartTime = (time: string | undefined) =>
  time?.split("-")[0].trim();
export const getEndTime = (time: string | undefined) =>
  time?.split("-")[1]?.trim();
export const joinTime = (start: string | undefined, end: string | undefined) =>
  !start ? undefined : !end ? start : `${start} - ${end}`;
