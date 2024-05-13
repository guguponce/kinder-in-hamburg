export interface iPost {
  title: string;
  text: TypeAndText[];
  tags?: string[];
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
  bezirk?: iBezirk | undefined;
  stadtteil?: string | undefined;
  address?: iAddress | undefined;
  lat?: number;
  lon?: number;
  user_id: string;
  addedBy: iSessionUser;
}

export interface iPostWithCoordinates extends iPost {
  lat: number;
  lon: number;
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
  bezirk: iBezirk;
  stadtteil: string;
  address: string;
  minAge: number;
  maxAge: null;
  igAccounts: string;
  lastUpdate: null;
  pinnedPost: boolean | null;
  user_id: string;
  addedBy: string;
  lat?: number;
  lon?: number;
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
  flohmaerkteSubmitted: number[] | null;
  name: string;
  email: string;
  image: string;
  postsSubmitted?: number[] | null;
}
export interface iStringifiedContributor {
  id: string;
  name: string;
  email: string;
  image: string;
  flohmaerkteSubmitted: string;
  postsSubmitted: string;
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
  precip_mm: number;
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
  totalprecip_mm: number;
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
  precip_mm: number;
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

export interface VisualCrossing {
  queryCost: number;
  latitude: number;
  longitude: number;
  resolvedAddress: string;
  address: string;
  timezone: string;
  tzoffset: number;
  days: CurrentConditions[];
  stations: { [key: string]: Station };
  currentConditions: CurrentConditions;
}

export interface CurrentConditions {
  datetime: string;
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  humidity: number;
  dew: number;
  precip: number;
  precipprob: number;
  snow: number;
  snowdepth: number;
  preciptype: string[] | null;
  windgust: number | null;
  windspeed: number;
  winddir: number;
  pressure: number;
  visibility: number;
  cloudcover: number;
  solarradiation: number;
  solarenergy: number;
  uvindex: number;
  conditions: string;
  icon: string;
  stations: string[] | null;
  source: string;
  sunrise?: string;
  sunriseEpoch?: number;
  sunset?: string;
  sunsetEpoch?: number;
  moonphase?: number;
  tempmax?: number;
  tempmin?: number;
  feelslikemax?: number;
  feelslikemin?: number;
  precipcover?: number;
  severerisk?: number;
  description?: string;
  hours?: CurrentConditions[];
}

export interface Station {
  distance: number;
  latitude: number;
  longitude: number;
  useCount: number;
  id: string;
  name: string;
  quality: number;
  contribution: number;
}

export type categoryName =
  | "Indoor"
  | "Outdoor"
  | "Spielplatz"
  | "Museum"
  | "Kostenlos"
  | "Essen/Café"
  | "Sport"
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
  title: string;
  bezirk: iBezirk;
  stadtteil: string;
  addedBy: iSessionUser;
  createdAt: number;
  date: number;
  id: number;
  status: "approved" | "pending" | "rejected" | null;
  address: string;
  image?: string;
  location?: string;
  time?: string;
  optionalComment?: string;
  lat?: number;
  lon?: number;
}

export interface iFlohmarktWithCoordinates extends iFlohmarkt {
  lat: number;
  lon: number;
}

export interface iStringifiedFlohmarkt extends Omit<iFlohmarkt, "addedBy"> {
  addedBy: string;
}

export type Filter =
  | "categories"
  | "bezirk"
  | "fromAge"
  | "untilAge"
  | "pinnedPosts"
  | "search";
export interface FilterObject {
  categories?: string[];
  bezirk?: string;
  fromAge?: number;
  untilAge?: number;
  pinnedPosts?: boolean;
  search?: string;
}
