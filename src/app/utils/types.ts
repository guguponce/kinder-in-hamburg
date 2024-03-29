export interface iPost {
  title: string;
  text: string | TypeAndText[];
  tags: string[];
  pinnedPost?: boolean; //
  minAge?: number | undefined;
  maxAge?: number | undefined;
  link?: string | undefined;
  lastUpdate?: number;
  image?: string[]; //
  igAccounts?: iIgAccount[]; //
  id: number;
  createdAt: number;
  categories: string[];
  bezirk?: string | undefined;
  address?: iAddress | undefined;
}

export interface iAddress {
  street?: string;
  number?: string;
  PLZ?: string;
  city?: string;
}

export interface iIgAccount {
  name: string;
  description: string;
}
export interface iCurrentIGAccount {
  name?: string;
  description?: string;
}

export interface iStringifiedRetrievedPost {
  id: number;
  createdAt: number;
  title: string;
  text: string;
  categories: string;
  tags: string;
  image: string;
  link: string;
  bezirk: string;
  address: string;
  minAge: number;
  maxAge: null;
  igAccounts: string;
  lastUpdate: null;
  pinnedPost: boolean | null;
  user_id: string;
  addedBy: string;
}

export interface iSessionUser {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  token?: string | null | undefined;
}

export interface iContributor {
  id: string;
  firstContribution: number;
  name: string;
  email: string;
  image: string;
  postSubmitted?: number[] | null;
}

export interface iParsedRetrievedPost extends iPost {
  user_id: string;
  addedBy: iSessionUser;
}

//FORMS
export const TEXT_TYPES = [
  "paragraph",
  "small-paragraph",
  "large-paragraph",
  "subtitle1",
  "subtitle2",
  "link",
  "numbered-list",
  "points-list",
  "quote",
  "separator",
] as const;
export type TextType = (typeof TEXT_TYPES)[number];

export type TypeAndText = [TextType, string];
