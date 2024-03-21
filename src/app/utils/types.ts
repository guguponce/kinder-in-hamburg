export interface iPost {
  id: string;
  createdAt: string;
  title: string;
  text: string;
  categories: string[];
  tags: string[];
  image?: string[];
  link?: string[] | undefined;
  address?: string | undefined;
  bezirk?: string | undefined;
  minAge?: string | undefined;
  maxAge?: string | undefined;
  igAccounts?: iIgAccount[];
  lastUpdate?: string;
}

export interface iIgAccount {
  name: string;
  description: string;
}

export interface iRetrievedPost {
  id: string;
  data: iPost;
}
