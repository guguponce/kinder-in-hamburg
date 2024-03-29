import {
  iAddress,
  iParsedRetrievedPost,
  iStringifiedRetrievedPost,
} from "./types";

export const postDate = () => new Date().getTime();

export const getImagesArray = (images: string) => {
  return images.replace("[", "").replace("]", "").split(",");
};

export const parsePost = (
  post: iStringifiedRetrievedPost
): iParsedRetrievedPost => {
  return {
    user_id: post.user_id,
    title: post.title,
    text:
      typeof JSON.parse(post.text) === "string"
        ? ["paragraph", post.text]
        : JSON.parse(post.text),
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
      ? typeof JSON.parse(post.address) === "string"
        ? post.address
        : JSON.parse(post.address)
      : undefined,
    addedBy: JSON.parse(post.addedBy),
  };
};

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
  const maxSize = 10000000;
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
