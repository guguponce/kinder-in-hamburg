export interface iPost {
  title: string;
  text: TypeAndText[];
  tags: string[];
  id: number;
  createdAt: number;
  categories: string[];
  status: "approved" | "pending" | "rejected" | null;
  pinnedPost?: boolean; //
  minAge?: number | undefined;
  maxAge?: number | undefined;
  link?: string | undefined;
  lastUpdate?: number;
  image?: string[]; //
  igAccounts?: iIgAccount[]; //
  bezirk?: string | undefined;
  address?: iAddress | undefined;
  user_id: string;
  addedBy: iSessionUser;
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
  status: "approved" | "pending" | "rejected" | null;
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

export interface iCard {
  size?: "small" | "medium" | "large";
  id: number;
  title: string;
  image: string;
  description?: string;
  categories?: string;
  bezirk?: string;
  link?: string;
  aspectRatio?: number;
}

// WEATHERAPI
export interface WeatherAPI {
  location: Location;
  current: Current;
  forecast: Forecast;
}

export interface Current {
  temp_c: number;
  is_day: number;
  condition: Condition;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  uv: number;
}

export interface Condition {
  text: string;
  icon: string;
  code: number;
}

export interface Forecast {
  forecastday: Forecastday[];
}

export interface Forecastday {
  date: Date;
  day: Day;
  astro: Astro;
  hour: Hour[];
}

export interface Astro {
  sunrise: string;
  sunset: string;
}

export interface Day {
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  totalprecip_in: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: Condition;
  uv: number;
}

export interface Hour {
  time: string;
  temp_c: number;
  is_day: number;
  condition: Condition;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  uv: number;
}

export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export type categoryName =
  | "Indoor"
  | "Outdoor"
  | "Spielplatz"
  | "Museum"
  | "Kostenlos"
  | "Essen/Café"
  | "Unter 2"
  | "Tiere"
  | "Geburtstage"
  | "Wochenende Ausflüge"
  | "Shops";

export type overallCondition =
  | "Sunny"
  | "Cloudy"
  | "Rainy"
  | "Snowy"
  | "Stormy"
  | "Foggy"
  | "Partly cloudy";

export type iBezirk =
  | "Hamburg-Mitte"
  | "Altona"
  | "Eimsbüttel"
  | "Hamburg-Nord"
  | "Wandsbek"
  | "Bergedorf"
  | "Harburg"
  | "Außerhalb Hamburg";

// FLOHMARKT
export interface iFlohmarkt {
  id: number;
  createdAt: number;
  date: number;
  address: string;
  bezirk: iBezirk;
  time?: string;
  title?: string;
  image?: string;
  location?: string;
  free?: boolean;
  addedBy: iSessionUser;
  status: "approved" | "pending" | "rejected" | null;
}

export interface iStringifiedFlohmarkt extends Omit<iFlohmarkt, "addedBy"> {
  addedBy: string;
}
