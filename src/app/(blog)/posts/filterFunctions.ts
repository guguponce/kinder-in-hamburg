import { bezirke as bezirkeNames, categoryNames } from "@app/utils/constants";
import { getPlainText } from "@app/utils/functions";
import { iBezirk, iPost } from "@app/utils/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const orderListFx = (list: iPost[], order: string) => {
  switch (order) {
    case "neueste":
      return [...list].sort(
        (a, b) => (b.lastUpdate || b.createdAt) - (a.lastUpdate || a.createdAt)
      );
    case "beliebste":
      return [...list].sort((a, b) =>
        a.pinnedPost ? -1 : b.pinnedPost ? 1 : 0
      );
    case "az":
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    case "za":
      return [...list].sort((a, b) => b.title.localeCompare(a.title));
    default:
      return list;
  }
};

export const filterCategoriesFX = (
  list: iPost[],
  categories: string[],
  every: boolean
) => {
  if (!categories.length) return list;
  return list.filter((post) => {
    if (every) return categories.every((cat) => post.categories.includes(cat));
    return categories.some((cat) => post.categories.includes(cat));
  });
};

export const filterBezirkeFX = (list: iPost[], bezirke: string[]) => {
  if (!bezirke.length) return list;
  return list.filter((post) => bezirke.includes(post.bezirk));
};
export const filterStadtteileFX = (list: iPost[], stadtteile: string[]) => {
  if (!stadtteile.length) return list;
  return list.filter((post) => {
    return stadtteile.includes(post.stadtteil);
  });
};

export const filterAlterFX = (list: iPost[], queryAlter: string) => {
  if (!queryAlter) return list;
  return list.filter((post) => {
    const postMinAge = post.minAge || 0;
    const postMaxAge = post.maxAge || 100;
    const alter = parseInt(queryAlter);
    if (!!postMinAge && postMinAge >= alter) {
      return false;
    }
    if (!!postMaxAge && postMaxAge <= alter) {
      return false;
    }
    return true;
  });
};

export const filteredBySearchFX = (list: iPost[], searchQuery: string) => {
  if (!searchQuery) return list;
  return list.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getPlainText(post.text).toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const filterAndSearchPosts = (
  list: iPost[],
  searchQuery: string,
  queryAlter: string,
  bezirkeFilter: string[],
  categoriesFilter: string[],
  order: string,
  everyCategory: boolean
) => {
  const orderedList = orderListFx(list, order);
  const filteredBySearch = filteredBySearchFX(orderedList, searchQuery);
  const filteredByAlter = filterAlterFX(filteredBySearch, queryAlter);
  const filteredByBezirke = filterBezirkeFX(filteredByAlter, bezirkeFilter);
  return filterCategoriesFX(filteredByBezirke, categoriesFilter, everyCategory);
};

export const createQueryString = (
  name: string,
  value: string,
  params: URLSearchParams
) => {
  if (params.has(name)) {
    params.delete(name);
  }
  if (!!value) {
    params.set(name, value);
  }

  return params.toString();
};

export const createArrayQueryString = (
  name: string,
  value: string,
  array: string[],
  params: URLSearchParams
) => {
  const oldValues = params.getAll(name);
  const currentValues = array.includes(value)
    ? array.filter((v) => v !== value)
    : [...oldValues, value];
  params.delete(name);
  currentValues.forEach((v) => params.append(name, encodeURIComponent(v)));
  return params.toString();
};

export const removeFilter = ({
  state,
  arrayStateSetter,
  stringStateSetter,
  filterType,
  value,
  router,
  params,
  searchParams,
}: {
  state: string[] | string;
  filterType: string;
  arrayStateSetter?: React.Dispatch<React.SetStateAction<string[]>>;
  stringStateSetter?: React.Dispatch<React.SetStateAction<string>>;
  router: AppRouterInstance;
  value: string;
  params: string;
  searchParams: URLSearchParams;
}) => {
  const stateType = typeof state;
  if (stateType === "string" && stringStateSetter) {
    stringStateSetter((prev) => (value === "all" ? "" : value));
    router.push(
      params +
        "?" +
        createQueryString(
          filterType,
          "",
          new URLSearchParams(searchParams.toString())
        ),
      { scroll: false }
    );
  } else if (stateType === "object" && arrayStateSetter) {
    arrayStateSetter(
      value === "all" ? [] : (state as string[]).filter((v) => v !== value)
    );
    router.push(
      params +
        "?" +
        createArrayQueryString(
          filterType,
          value,
          value === "all" ? [] : (state as string[]),
          new URLSearchParams(searchParams.toString())
        ),
      { scroll: false }
    );
  }
};

export const getAvailableStadtteile = (
  postsList: iPost[],
  bezirke: iBezirk[]
) => {
  const bWS = postsList.reduce(
    (acc, post) => {
      const { stadtteil, bezirk } = post;
      if (!bezirke.includes(bezirk) || !stadtteil) return acc;

      if (!acc[bezirk]) acc[bezirk] = new Set<string>();

      acc[bezirk].add(stadtteil);

      return acc;
    },
    {} as Record<string, Set<string>>
  );

  const result = Object.fromEntries(
    Object.entries(bWS).map(([bezirk, stadtteileSet]) => [
      bezirk,
      Array.from(stadtteileSet),
    ])
  );

  return result;
};

export const getAvailableBezirke = (postsList: iPost[]) => {
  let bezirke = new Set<iBezirk>();
  for (let i = 0; i < postsList.length; i++) {
    const { bezirk } = postsList[i];
    bezirke.add(bezirk);
    if (bezirke.size === bezirkeNames.length) break;
  }
  return Array.from(bezirke).sort((a, b) => a.localeCompare(b));
};
export const getAvailableCategories = (postsList: iPost[]) => {
  let categories = new Set<string>();
  for (let i = 0; i < postsList.length; i++) {
    const { categories: cats } = postsList[i];
    for (let j = 0; j < cats.length; j++) {
      categories.add(cats[j]);
      if (categories.size === categoryNames.length) break;
    }
    if (categories.size === categoryNames.length) break;
  }
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
};
export type orderType = "neueste" | "beliebste" | "az" | "za";
export const orderOptionsNames = {
  neueste: "Neueste",
  beliebste: "Beliebteste",
  az: "A-Z (Name)",
  za: "Z-A (Name)",
};
export const orderOptions: Array<orderType> = [
  "neueste",
  "beliebste",
  "az",
  "za",
];
export const isTypeOrder = (type: string | null): type is orderType => {
  if (!type) return false;
  return type in orderOptionsNames;
};
