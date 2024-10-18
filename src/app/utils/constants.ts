import {
  categoryName,
  iBezirk,
  iEventType,
  iSpielgeräte,
  overallCondition,
} from "./types";

export const bezirke: iBezirk[] = [
  "Hamburg-Mitte",
  "Altona",
  "Eimsbüttel",
  "Hamburg-Nord",
  "Wandsbek",
  "Bergedorf",
  "Harburg",
  "Außerhalb Hamburg",
];

export const eventTypes: iEventType[] = [
  "flohmarkt",
  "laterne",
  "weinachtsmarkt",
];

export const categoryNames = [
  "Indoor",
  "Outdoor",
  "Wochenende Ausflüge",
  "Kostenlos",
  "Spielplatz",
  "Museum",
  "Unter 2",
  "Tiere",
  "Sport",
  "Geburtstage",
  "Essen/Café",
  "Shops",
  "Spielhaus",
  "Jugendeinrichtung",
  "Badeplatz",
];

export const relatedCategories: { [x: string]: categoryName[] } = {
  Indoor: ["Spielplatz", "Museum", "Essen/Café"],
  Outdoor: ["Wochenende Ausflüge", "Spielplatz", "Tiere"],
  Spielplatz: ["Outdoor", "Indoor", "Tiere"],
  Museum: ["Indoor", "Essen/Café", "Outdoor"],
  Shops: ["Essen/Café", "Museum", "Indoor"],
  Kostenlos: ["Essen/Café", "Shops", "Wochenende Ausflüge"],
  "Essen/Café": ["Kostenlos", "Indoor", "Shops"],
  "Unter 2": ["Spielplatz", "Indoor", "Museum"],
  Tiere: ["Outdoor", "Spielplatz", "Wochenende Ausflüge"],
  Geburtstage: ["Shops", "Indoor", "Kostenlos"],
  "Wochenende Ausflüge": ["Outdoor", "Tiere", "Kostenlos"],
  Sport: ["Outdoor", "Indoor", "Spielplatz"],
  Badeplatz: ["Outdoor", "Wochenende Ausflüge"],
  Spielhaus: ["Kostenlos", "Indoor", "Spielplatz", "Jugendeinrichtung"],
  Jugendeinrichtung: ["Kostenlos", "Indoor", "Spielhaus"],
};

export const WEATHER_CODES: {
  [x: string]: {
    code: number;
    day: string;
    night: string;
    icon: number;
    overallCondition: overallCondition;
    activity: "Outdoor" | "Indoor" | "Both";
  };
} = {
  "1": {
    code: 1,
    day: "Sunny",
    night: "Clear",
    icon: 113,
    overallCondition: "Sunny",
    activity: "Outdoor",
  },
  "2": {
    code: 2,
    day: "Mostly sunny",
    night: "Mostly sunny",
    icon: 116,
    overallCondition: "Partly cloudy",
    activity: "Outdoor",
  },
  "3": {
    code: 3,
    day: "Partly sunny",
    night: "Partly sunny",
    icon: 116,
    overallCondition: "Partly cloudy",
    activity: "Outdoor",
  },
  "4": {
    code: 4,
    day: "Intermittent Clouds",
    night: "Intermittent Clouds",
    icon: 116,
    overallCondition: "Partly cloudy",
    activity: "Outdoor",
  },
  "5": {
    code: 5,
    day: "Hazy Sunshine",
    night: "Hazy Sunshine",
    icon: 116,
    overallCondition: "Partly cloudy",
    activity: "Outdoor",
  },
  "6": {
    code: 6,
    day: "Mostly Cloudy",
    night: "Mostly Cloudy",
    icon: 119,
    overallCondition: "Cloudy",
    activity: "Both",
  },
  "7": {
    code: 7,
    day: "Cloudy",
    night: "Cloudy",
    icon: 119,
    overallCondition: "Cloudy",
    activity: "Both",
  },
  "8": {
    code: 8,
    day: "Overcast",
    night: "Overcast",
    icon: 122,
    overallCondition: "Cloudy",
    activity: "Both",
  },
  "11": {
    code: 11,
    day: "Mist",
    night: "Mist",
    icon: 143,
    overallCondition: "Foggy",
    activity: "Indoor",
  },
  "12": {
    code: 12,
    day: "Showers",
    night: "Showers",
    icon: 143,
    overallCondition: "Rainy",
    activity: "Indoor",
  },
  "13": {
    code: 13,
    day: "Mostly Cloudy w/ Showers",
    night: "Mostly Cloudy w/ Showers",
    icon: 176,
    overallCondition: "Rainy",
    activity: "Indoor",
  },
  "14": {
    code: 14,
    day: "Partly Sunny w/ Showers",
    night: "Partly Sunny w/ Showers",
    icon: 176,
    overallCondition: "Rainy",
    activity: "Indoor",
  },
  "15": {
    code: 15,
    day: "T-Storms",
    night: "T-Storms",
    icon: 389,
    overallCondition: "Stormy",
    activity: "Indoor",
  },

  "21": {
    code: 21,
    day: "Partly Sunny w/ Flurries",
    night: "Partly Sunny w/ Flurries",
    icon: 179,
    overallCondition: "Rainy",
    activity: "Indoor",
  },

  "18": {
    code: 18,
    day: "Rain",
    night: "Rain",
    icon: 302,
    overallCondition: "Rainy",
    activity: "Indoor",
  },
  "19": {
    code: 20,
    day: "Flurries",
    night: "Flurries",
    icon: 305,
    overallCondition: "Rainy",
    activity: "Indoor",
  },
  "20": {
    code: 20,
    day: "Mostly Cloudy w/ Flurries",
    night: "Mostly Cloudy w/ Flurries",
    icon: 308,
    overallCondition: "Rainy",
    activity: "Indoor",
  },

  "44": {
    code: 44,
    day: "Mostly Cloudy w/ Snow",
    night: "Mostly Cloudy w/ Snow",
    icon: 314,
    overallCondition: "Snowy",
    activity: "Indoor",
  },

  "23": {
    code: 23,
    day: "Mostly Cloudy w/ Snow",
    night: "Mostly Cloudy w/ Snow",
    icon: 323,
    overallCondition: "Snowy",
    activity: "Indoor",
  },
  "24": {
    code: 24,
    day: "Ice",
    night: "Ice",
    icon: 326,
    overallCondition: "Snowy",
    activity: "Indoor",
  },
  "22": {
    code: 22,
    day: "Snow",
    night: "Snow",
    icon: 329,
    overallCondition: "Snowy",
    activity: "Indoor",
  },
  "39": {
    code: 39,
    day: "Partly Cloudy w/ T-Storms",
    night: "Partly Cloudy w/ T-Storms",
    icon: 332,
    overallCondition: "Rainy",
    activity: "Indoor",
  },
  "40": {
    code: 40,
    day: "Mostly Cloudy w/ Showers",
    night: "Mostly Cloudy w/ Showers",
    icon: 332,
    overallCondition: "Rainy",
    activity: "Indoor",
  },
  "41": {
    code: 41,
    day: "Mostly Cloudy w/ T-Storms",
    night: "Mostly Cloudy w/ T-Storms",
    icon: 332,
    overallCondition: "Rainy",
    activity: "Indoor",
  },
  "42": {
    code: 42,
    day: "Mostly Cloudy w/ Showers",
    night: "Mostly Cloudy w/ Showers",
    icon: 332,
    overallCondition: "Rainy",
    activity: "Indoor",
  },
  "43": {
    code: 43,
    day: "Mostly Cloudy w/ Flurries",
    night: "Mostly Cloudy w/ Flurries",
    icon: 332,
    overallCondition: "Rainy",
    activity: "Indoor",
  },
  "38": {
    code: 38,
    day: "Mostly Cloudy",
    night: "Mostly Cloudy",
    icon: 335,
    overallCondition: "Cloudy",
    activity: "Indoor",
  },
  "35": {
    code: 35,
    day: "Partly cloudy",
    night: "Partly cloudy",
    icon: 338,
    overallCondition: "Cloudy",
    activity: "Both",
  },
  "36": {
    code: 36,
    day: "Intermittent Clouds",
    night: "Intermittent Clouds",
    icon: 338,
    overallCondition: "Cloudy",
    activity: "Both",
  },
  "37": {
    code: 37,
    day: "Hazy Moonlight",
    night: "Hazy Moonlight",
    icon: 338,
    overallCondition: "Cloudy",
    activity: "Both",
  },
  "25": {
    code: 25,
    day: "Sleet",
    night: "Sleet",
    icon: 350,
    overallCondition: "Stormy",
    activity: "Indoor",
  },
  "26": {
    code: 26,
    day: "Freezing Rain",
    night: "Freezing Rain",
    icon: 368,
    overallCondition: "Snowy",
    activity: "Indoor",
  },
  "30": {
    code: 30,
    day: "Hot",
    night: "Hot",
    icon: 371,
    overallCondition: "Sunny",
    activity: "Outdoor",
  },
  "31": {
    code: 32,
    day: "Cold",
    night: "Cold",
    icon: 374,
    overallCondition: "Snowy",
    activity: "Indoor",
  },
  "32": {
    code: 32,
    day: "Windy",
    night: "Windy",
    icon: 377,
    overallCondition: "Partly cloudy",
    activity: "Indoor",
  },
  "17": {
    code: 17,
    day: "Patchy light rain with thunder",
    night: "Patchy light rain with thunder",
    icon: 386,
    overallCondition: "Stormy",
    activity: "Indoor",
  },
  "16": {
    code: 16,
    day: "Moderate or heavy rain with thunder",
    night: "Moderate or heavy rain with thunder",
    icon: 389,
    overallCondition: "Stormy",
    activity: "Indoor",
  },
  "33": {
    code: 33,
    day: "Clear",
    night: "Clear",
    icon: 392,
    overallCondition: "Sunny",
    activity: "Outdoor",
  },
  "34": {
    code: 34,
    day: "Mostly clear",
    night: "Mostly clear",
    icon: 395,
    overallCondition: "Sunny",
    activity: "Outdoor",
  },
} as const;

export const addressPartsArray: Array<"street" | "number" | "PLZ" | "city"> = [
  "street",
  "number",
  "PLZ",
  "city",
];

// icons
// loading
{
  /* <a href="https://storyset.com/people">People illustrations by Storyset</a> */
}
// <a href="https://storyset.com/transport">Transport illustrations by Storyset</a>

export const BEZIRK_TO_STADTTEILE: { [key in iBezirk]: string[] } = {
  "Hamburg-Mitte": [
    "Hamburg-Altstadt",
    "HafenCity",
    "Neustadt",
    "St. Pauli",
    "St. Georg",
    "Hammerbrook",
    "Borgfelde",
    "Hamm",
    "Horn",
    "Billstedt",
    "Billbrook",
    "Rothenburgsort",
    "Veddel",
    "Wilhelmsburg",
    "Kleiner Grasbrook",
    "Steinwerder",
    "Waltershof",
    "Finkenwerder",
    "Neuwerk",
  ],
  Altona: [
    "Altona-Altstadt",
    "Sternschanze",
    "Altona-Nord",
    "Ottensen",
    "Bahrenfeld",
    "Groß Flottbek",
    "Othmarschen",
    "Lurup",
    "Osdorf",
    "Nienstedten",
    "Blankenese",
    "Iserbrook",
    "Sülldorf",
    "Rissen",
  ],
  Eimsbüttel: [
    "Eimsbüttel",
    "Rotherbaum",
    "Harvestehude",
    "Hoheluft-West",
    "Lokstedt",
    "Niendorf",
    "Schnelsen",
    "Eidelstedt",
    "Stellingen",
  ],
  "Hamburg-Nord": [
    "Hoheluft-Ost",
    "Eppendorf",
    "Groß Borstel",
    "Alsterdorf",
    "Winterhude",
    "Uhlenhorst",
    "Hohenfelde",
    "Barmbek-Süd",
    "Dulsberg",
    "Barmbek-Nord",
    "Ohlsdorf",
    "Fuhlsbüttel",
    "Langenhorn",
  ],
  Wandsbek: [
    "Eilbek",
    "Wandsbek",
    "Marienthal",
    "Jenfeld",
    "Tonndorf",
    "Farmsen-Berne",
    "Bramfeld",
    "Steilshoop",
    "Wellingsbüttel",
    "Sasel",
    "Poppenbüttel",
    "Hummelsbüttel",
    "Lemsahl-Mellingstedt",
    "Duvenstedt",
    "Wohldorf-Ohlstedt",
    "Bergstedt",
    "Volksdorf",
    "Rahlstedt",
  ],
  Bergedorf: [
    "Lohbrügge",
    "Bergedorf",
    "Curslack",
    "Altengamme",
    "Neuengamme",
    "Kirchwerder",
    "Ochsenwerder",
    "Reitbrook",
    "Allermöhe",
    "Billwerder",
    "Moorfleet",
    "Tatenberg",
    "Spadenland",
    "Neuallermöhe",
  ],
  Harburg: [
    "Harburg",
    "Neuland",
    "Gut Moor",
    "Wilstorf",
    "Rönneburg",
    "Langenbek",
    "Sinstorf",
    "Marmstorf",
    "Eißendorf",
    "Heimfeld",
    "Moorburg",
    "Altenwerder",
    "Hausbruch",
    "Neugraben-Fischbek",
    "Francop",
    "Neuenfelde",
    "Cranz",
  ],
  "Außerhalb Hamburg": [
    "Ahrensburg",
    "Bargteheide",
    "Bönningstedt",
    "Ellerbek",
    "Halstenbek",
    "Norderstedt",
    "Lüneburg",
    "Pinneberg",
    "Quickborn",
    "Rellingen",
    "Schenefeld",
    "Tangstedt",
    "Andere Orte",
  ],
};

export const STADTTEILE_TO_BEZIRK: { [key: string]: iBezirk } = {
  "Altona-Altstadt": "Altona",
  "Altona-Nord": "Altona",
  Bahrenfeld: "Altona",
  Blankenese: "Altona",
  "Groß Flottbek": "Altona",
  Iserbrook: "Altona",
  Lurup: "Altona",
  Nienstedten: "Altona",
  Osdorf: "Altona",
  Othmarschen: "Altona",
  Sülldorf: "Altona",
  Rissen: "Altona",
  Allermöhe: "Bergedorf",
  Altengamme: "Bergedorf",
  Bergedorf: "Bergedorf",
  Billwerder: "Bergedorf",
  Curslack: "Bergedorf",
  Kirchwerder: "Bergedorf",
  Lohbrügge: "Bergedorf",
  Moorfleet: "Bergedorf",
  Neuallermöhe: "Bergedorf",
  Neuengamme: "Bergedorf",
  Ochsenwerder: "Bergedorf",
  Reitbrook: "Bergedorf",
  Spadenland: "Bergedorf",
  Tatenberg: "Bergedorf",
  Eidelstedt: "Eimsbüttel",
  Eimsbüttel: "Eimsbüttel",
  "Hoheluft-West": "Eimsbüttel",
  "Hoheluft-Ost": "Eimsbüttel",
  Lokstedt: "Eimsbüttel",
  Niendorf: "Eimsbüttel",
  Rotherbaum: "Eimsbüttel",
  Schnelsen: "Eimsbüttel",
  Stellingen: "Eimsbüttel",
  Altstadt: "Hamburg-Mitte",
  Billbrook: "Hamburg-Mitte",
  Billstedt: "Hamburg-Mitte",
  Borgfelde: "Hamburg-Mitte",
  Finkenwerder: "Hamburg-Mitte",
  HafenCity: "Hamburg-Mitte",
  Hamm: "Hamburg-Mitte",
  Hammerbrook: "Hamburg-Mitte",
  Horn: "Hamburg-Mitte",
  "Kleiner Grasbrook": "Hamburg-Mitte",
  Neustadt: "Hamburg-Mitte",
  Neuwerk: "Hamburg-Mitte",
  Rothenburgsort: "Hamburg-Mitte",
  Steinwerder: "Hamburg-Mitte",
  Veddel: "Hamburg-Mitte",
  Waltershof: "Hamburg-Mitte",
  Wilhelmsburg: "Hamburg-Mitte",
  Alsterdorf: "Hamburg-Nord",
  "Barmbek-Nord": "Hamburg-Nord",
  "Barmbek-Süd": "Hamburg-Nord",
  Dulsberg: "Hamburg-Nord",
  Eppendorf: "Hamburg-Nord",
  Fuhlsbüttel: "Hamburg-Nord",
  "Groß Borstel": "Hamburg-Nord",
  Hohenfelde: "Hamburg-Nord",
  Langenhorn: "Hamburg-Nord",
  Ohlsdorf: "Hamburg-Nord",
  Uhlenhorst: "Hamburg-Nord",
  Winterhude: "Hamburg-Nord",
  Altenwerder: "Harburg",
  Cranz: "Harburg",
  Eißendorf: "Harburg",
  Francop: "Harburg",
  "Gut Moor": "Harburg",
  Harburg: "Harburg",
  Hausbruch: "Harburg",
  Heimfeld: "Harburg",
  Langenbek: "Harburg",
  Marmstorf: "Harburg",
  Neuenfelde: "Harburg",
  "Neugraben-Fischbek": "Harburg",
  Neuland: "Harburg",
  Rönneburg: "Harburg",
  Sinstorf: "Harburg",
  Wilstorf: "Harburg",
  Bergstedt: "Wandsbek",
  Bramfeld: "Wandsbek",
  Duvenstedt: "Wandsbek",
  Eilbek: "Wandsbek",
  "Farmsen-Berne": "Wandsbek",
  Hummelsbüttel: "Wandsbek",
  Jenfeld: "Wandsbek",
  "Lemsahl-Mellingstedt": "Wandsbek",
  Marienthal: "Wandsbek",
  Poppenbüttel: "Wandsbek",
  Rahlstedt: "Wandsbek",
  Sasel: "Wandsbek",
  Steilshoop: "Wandsbek",
  Tonndorf: "Wandsbek",
  Volksdorf: "Wandsbek",
  Wandsbek: "Wandsbek",
  Wellingsbüttel: "Wandsbek",
};

export const PLZ_TO_STADTTEIL = {
  "20095": ["Hamburg-Altstadt", "Hammerbrook", "St. Georg"],
  "20097": ["Hamm", "Hammerbrook", "St. Georg"],
  "20099": ["Hamburg-Altstadt", "St. Georg"],
  "20144": ["Eimsbüttel", "Harvestehude", "Hoheluft-Ost", "Rotherbaum"],
  "20146": ["Harvestehude", "Rotherbaum"],
  "20148": ["Harvestehude", "Rotherbaum"],
  "20149": ["Harvestehude", "Rotherbaum"],
  "20249": ["Eppendorf", "Harvestehude", "Hoheluft-Ost"],
  "20251": ["Alsterdorf", "Eppendorf", "Hoheluft-Ost"],
  "20253": [
    "Eimsbüttel",
    "Harvestehude",
    "Hoheluft-Ost",
    "Hoheluft-West",
    "Lokstedt",
  ],
  "20255": ["Eimsbüttel", "Lokstedt", "Stellingen"],
  "20257": [
    "Altona-Nord",
    "Eimsbüttel",
    "Rotherbaum",
    "St. Pauli",
    "Sternschanze",
  ],
  "20259": ["Eimsbüttel"],
  "20354": ["Neustadt", "Rotherbaum", "St. Pauli"],
  "20355": ["Neustadt", "St. Pauli"],
  "20357": [
    "Altona-Nord",
    "Eimsbüttel",
    "Rotherbaum",
    "St. Pauli",
    "Sternschanze",
  ],
  "20359": ["Altona-Altstadt", "Neustadt", "St. Pauli", "Sternschanze"],
  "20457": [
    "Hamburg-Altstadt",
    "HafenCity",
    "Kleiner Grasbrook",
    "Neustadt",
    "Steinwerder",
  ],
  "20459": ["Neustadt"],
  "20535": ["Borgfelde", "Hamm"],
  "20537": ["Borgfelde", "Hamm", "Hammerbrook"],
  "20539": [
    "HafenCity",
    "Kleiner Grasbrook",
    "Rothenburgsort",
    "Veddel",
    "Wilhelmsburg",
  ],
  "21029": ["Altengamme", "Bergedorf", "Curslack"],
  "21031": ["Bergedorf", "Lohbrügge"],
  "21033": ["Bergedorf", "Billwerder", "Lohbrügge"],
  "21035": ["Allermöhe", "Bergedorf", "Billwerder", "Neuallermöhe"],
  "21037": [
    "Allermöhe",
    "Curslack",
    "Kirchwerder",
    "Neuengamme",
    "Ochsenwerder",
    "Reitbrook",
    "Spadenland",
    "Tatenberg",
  ],
  "21039": ["Altengamme", "Bergedorf", "Curslack", "Neuengamme"],
  "21073": ["Eißendorf", "Harburg", "Heimfeld", "Wilstorf"],
  "21075": ["Eißendorf", "Harburg", "Hausbruch", "Heimfeld"],
  "21077": [
    "Eißendorf",
    "Langenbek",
    "Marmstorf",
    "Rönneburg",
    "Sinstorf",
    "Wilstorf",
  ],
  "21079": [
    "Gut Moor",
    "Harburg",
    "Hausbruch",
    "Heimfeld",
    "Langenbek",
    "Moorburg",
    "Neuland",
    "Rönneburg",
    "Sinstorf",
    "Wilstorf",
  ],
  "21107": ["Steinwerder", "Wilhelmsburg"],
  "21109": ["Veddel", "Wilhelmsburg"],
  "21129": [
    "Altenwerder",
    "Cranz",
    "Finkenwerder",
    "Francop",
    "Moorburg",
    "Neuland",
    "Waltershof",
  ],
  "21147": ["Hausbruch", "Neugraben-Fischbek"],
  "21149": ["Hausbruch", "Neugraben-Fischbek"],
  "22041": ["Marienthal", "Tonndorf", "Wandsbek"],
  "22043": ["Jenfeld", "Marienthal", "Tonndorf"],
  "22045": ["Jenfeld", "Tonndorf"],
  "22047": ["Bramfeld", "Tonndorf", "Wandsbek"],
  "22049": ["Dulsberg", "Wandsbek"],
  "22081": ["Barmbek-Süd", "Uhlenhorst"],
  "22083": ["Barmbek-Süd"],
  "22085": ["Barmbek-Süd", "Uhlenhorst"],
  "22087": ["Hamm", "Hohenfelde", "Uhlenhorst"],
  "22089": ["Eilbek", "Hamm", "Hohenfelde", "Marienthal", "Wandsbek"],
  "22111": ["Billstedt", "Hamm", "Horn"],
  "22113": [
    "Allermöhe",
    "Billbrook",
    "Billstedt",
    "Billwerder",
    "Horn",
    "Lohbrügge",
    "Moorfleet",
  ],
  "22115": ["Billstedt", "Lohbrügge"],
  "22117": ["Billstedt"],
  "22119": ["Billstedt", "Horn"],
  "22143": ["Rahlstedt"],
  "22145": ["Farmsen-Berne", "Rahlstedt"],
  "22147": ["Rahlstedt"],
  "22149": ["Rahlstedt", "Tonndorf"],
  "22159": ["Bramfeld", "Farmsen-Berne", "Sasel", "Tonndorf"],
  "22175": ["Bramfeld"],
  "22177": ["Bramfeld", "Steilshoop"],
  "22179": ["Bramfeld"],
  "22297": ["Barmbek-Nord", "Groß Borstel", "Winterhude"],
  "22299": ["Winterhude"],
  "22301": ["Winterhude"],
  "22303": ["Barmbek-Nord"],
  "22305": ["Alsterdorf", "Barmbek-Nord", "Barmbek-Süd", "Winterhude"],
  "22307": ["Barmbek-Nord", "Winterhude"],
  "22309": ["Barmbek-Nord", "Bramfeld", "Ohlsdorf", "Steilshoop"],
  "22335": ["Alsterdorf", "Fuhlsbüttel", "Groß Borstel", "Ohlsdorf"],
  "22337": ["Alsterdorf", "Ohlsdorf"],
  "22339": ["Fuhlsbüttel", "Hummelsbüttel"],
  "22359": ["Bergstedt", "Rahlstedt", "Volksdorf"],
  "22391": [
    "Bramfeld",
    "Hummelsbüttel",
    "Ohlsdorf",
    "Poppenbüttel",
    "Sasel",
    "Wellingsbüttel",
  ],
  "22393": ["Bramfeld", "Poppenbüttel", "Sasel", "Wellingsbüttel"],
  "22395": ["Bergstedt", "Poppenbüttel", "Sasel", "Wohldorf-Ohlstedt"],
  "22397": ["Duvenstedt", "Lemsahl-Mellingstedt", "Wohldorf-Ohlstedt"],
  "22399": ["Hummelsbüttel", "Lemsahl-Mellingstedt", "Poppenbüttel"],
  "22415": ["Fuhlsbüttel", "Hummelsbüttel", "Langenhorn"],
  "22417": ["Hummelsbüttel", "Langenhorn"],
  "22419": ["Langenhorn"],
  "22453": ["Groß Borstel", "Niendorf"],
  "22455": ["Niendorf"],
  "22457": ["Eidelstedt", "Niendorf", "Schnelsen"],
  "22459": ["Niendorf", "Schnelsen"],
  "22523": ["Eidelstedt"],
  "22525": ["Bahrenfeld", "Eidelstedt", "Eimsbüttel", "Lurup", "Stellingen"],
  "22527": ["Eidelstedt", "Eimsbüttel", "Lokstedt", "Stellingen"],
  "22529": [
    "Eppendorf",
    "Groß-Borstel",
    "Hoheluft-West",
    "Lokstedt",
    "Stellingen",
  ],
  "22547": ["Bahrenfeld", "Eidelstedt", "Lurup"],
  "22549": ["Bahrenfeld", "Lurup", "Osdorf"],
  "22559": ["Blankenese"],
  "22587": ["Blankenese", "Nienstedten", "Osdorf", "Rissen", "Sülldorf"],
  "22589": ["Blankenese", "Iserbrook", "Osdorf", "Sülldorf"],
  "22605": ["Bahrenfeld", "Groß Flottbek", "Othmarschen"],
  "22607": ["Bahrenfeld", "Groß Flottbek", "Nienstedten", "Othmarschen"],
  "22609": ["Groß Flottbek", "Nienstedten", "Othmarschen", "Osdorf"],
  "22761": ["Bahrenfeld"],
  "22763": ["Othmarschen", "Ottensen"],
  "22765": ["Altona-Altstadt", "Altona-Nord", "Ottensen"],
  "22767": ["Altona-Altstadt", "Ottensen", "St.Pauli", "Sternschanze"],
  "22769": [
    "Altona-Altstadt",
    "Altona-Nord",
    "Bahrenfeld",
    "Eimsbüttel",
    "St.Pauli",
    "Stellingen",
    "Sternschanze",
  ],
  "27499": ["Neuwerk"],
};
export const STADTTEIL_TO_PLZ = {
  Allermöhe: ["21035", "21037", "22113"],
  Alsterdorf: ["20251", "22297", "22335", "22337"],
  Altengamme: ["21029", "21039"],
  Altenwerder: ["21129"],
  "Altona-Altstadt": ["20359", "22765", "22767", "22769"],
  "Altona-Nord": ["20257", "20357", "22765", "22769"],
  Bahrenfeld: ["22525", "22547", "22549", "22605", "22607", "22761", "22769"],
  "Bahrenfeld Forts.": ["22769"],
  "Barmbek-Nord": ["22297", "22303", "22307", "22309"],
  "Barmbek-Süd": ["22081", "22083", "22085", "22305"],
  Bergedorf: ["21029", "21031", "21033", "21035", "21039"],
  Bergstedt: ["22359", "22395"],
  Billbrook: ["22113"],
  Billstedt: ["22111", "22113", "22115", "22117", "22119"],
  Billwerder: ["21033", "21035", "22113"],
  Blankenese: ["22587", "22589"],
  Borgfelde: ["20535", "20537"],
  Bramfeld: ["22047", "22159", "22175", "22177", "22179", "22309"],
  "Bramfeld Forts.": ["22391", "22393"],
  Cranz: ["21129"],
  Curslack: ["21029", "21037", "21039"],
  Dulsberg: ["22049"],
  Duvenstedt: ["22397"],
  Eidelstedt: ["22457", "22523", "22525", "22527", "22547"],
  Eilbek: ["22089"],
  Eimsbüttel: [
    "20144",
    "20253",
    "20255",
    "20257",
    "20259",
    "20357",
    "22525",
    "22527",
    "22769",
  ],
  "Eimsbüttel Forts.": ["22525", "22527", "22769"],
  Eißendorf: ["21073", "21075", "21077"],
  Eppendorf: ["20249", "20251", "22529"],
  "Farmsen-Berne": ["22159", "22145"],
  Finkenwerder: ["21129"],
  Francop: ["21129"],
  Fuhlsbüttel: ["22335", "22339", "22415"],
  "Groß Borstel": ["22297", "22335", "22453", "22529"],
  "Groß Flottbek": ["22605", "22607", "22609"],
  "Gut Moor": ["21079"],
  HafenCity: ["20457", "20539"],
  "Hamburg-Altstadt": ["20095", "20099", "20457"],
  Hamm: ["20097", "20535", "20537", "22087", "22089", "22111"],
  Hammerbrook: ["20095", "20097", "20537"],
  Harburg: ["21073", "21075", "21079"],
  Harvestehude: ["20144", "20146", "20148", "20149", "20249", "20253"],
  Hausbruch: ["21075", "21079", "21147", "21149"],
  Heimfeld: ["21073", "21075", "21079"],
  "Hoheluft-Ost": ["20144", "20249", "20251", "20253"],
  "Hoheluft-West": ["20253", "20255", "22529"],
  Hohenfelde: ["22087", "22089"],
  Horn: ["22111", "22113", "22119"],
  Hummelsbüttel: ["22339", "22391", "22399", "22145", "22417"],
  Iserbrook: ["22589"],
  Jenfeld: ["22043", "22045"],
  Kirchwerder: ["21037"],
  "Kleiner Grasbrook": ["20257", "20539"],
  Langenbek: ["21077", "21079"],
  Langenhorn: ["22415", "22417", "22419"],
  "Lemsahl-Mellingstedt": ["22397", "22399"],
  Lohbrügge: ["21031", "21033", "22113", "22115"],
  Lokstedt: ["20253", "20255", "22527", "22529"],
  Lurup: ["22525", "22547", "22549"],
  Marienthal: ["22041", "22043", "22089"],
  Marmstorf: ["21077"],
  Moorburg: ["21079", "21129"],
  Moorfleet: ["22113"],
  Neuallermöhe: ["21035"],
  Neuenfelde: ["21129"],
  Neuengamme: ["21037", "21039"],
  "Neugraben-Fischbek": ["21147", "21149"],
  Neuland: ["21079"],
  Neustadt: ["20354", "20355", "20359", "20457", "20459"],
  Neuwerk: ["27499"],
  Niendorf: ["22453", "22455", "22457", "22459"],
  Nienstedten: ["22587", "22607", "22609"],
  Ochsenwerder: ["21037"],
  Ohlsdorf: ["22309", "22335", "22337", "22391"],
  Osdorf: ["22549", "22587", "22589", "22609"],
  Othmarschen: ["22605", "22607", "22609", "22763"],
  Ottensen: ["22763", "22765", "22767"],
  Poppenbüttel: ["22391", "22393", "22395", "22399"],
  Rahlstedt: ["22143", "22145", "22147", "22149", "22359"],
  Reitbrook: ["21037"],
  Rissen: ["22559", "22587"],
  Rönneburg: ["21077", "21079"],
  Rothenburgsort: ["20539"],
  Rotherbaum: ["20144", "20146", "20148", "20149", "20354", "20357"],
  Sasel: ["22159", "22391", "22393", "22395"],
  Schnelsen: ["22457", "22459"],
  Sinstorf: ["21077", "21079"],
  Spadenland: ["21037"],
  "St. Georg": ["20095", "20097", "20099"],
  "St. Pauli": ["20354", "20355", "20357", "20359", "22767", "22769"],
  Steilshoop: ["22177", "22309"],
  Steinwerder: ["20457", "21107"],
  Stellingen: ["20255", "22525", "22527", "22529", "22769"],
  Sternschanze: ["20357", "20359", "22767", "22769"],
  Süllorf: ["22587", "22589"],
  Tatenberg: ["21037"],
  Tonndorf: ["22041", "22043", "22045", "22047", "22149", "22159"],
  Uhlenhorst: ["22081", "22085", "22087"],
  Veddel: ["20539", "21109"],
  Volksdorf: ["22359"],
  Waltershof: ["21129"],
  Wandsbek: ["22041", "22047", "22049", "22089"],
  Wellingsbüttel: ["22391", "22393"],
  Wilhelmsburg: ["20539", "21107", "21109"],
  Wilstorf: ["21073", "21077", "21079"],
  Winterhude: ["22297", "22299", "22301", "22303", "22305"],
  "Wohldorf-Ohlstedt": ["22395", "22397"],
};

export const PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK: { [x: string]: string[] } =
  {
    Lurup: ["Eidelstedt", "Stellingen"],
    Bahrenfeld: ["Eidelstedt", "Stellingen", "Eimsbüttel"],
    "Altona-Nord": [
      "Eimsbüttel",
      "St. Pauli",
      "Stellingen",
      "Hoheluft-West",
      "Rotherbaum",
    ],
    "Altona-Altstadt": ["St. Pauli", "Neustadt", "Eimsbüttel", "Rotherbaum"],
    Sternschanze: [
      "St. Pauli",
      "Eimsbüttel",
      "Rotherbaum",
      "Neustadt",
      "Harvestehude",
      "Hoheluft-West",
    ],
    "St. Pauli": [
      "Altona-Altstadt",
      "Sternschanze",
      "Eimsbüttel",
      "Rotherbaum",
      "Harvestehude",
      "Hoheluft-West",
    ],
    Neustadt: [
      "Altona-Altstadt",
      "Sternschanze",
      "Eimsbüttel",
      "Rotherbaum",
      "Harvestehude",
      "Hohenfelde",
    ],
    "Hamburg-Altona": [
      "Altona-Altstadt",
      "Sternschanze",
      "Rotherbaum",
      "Hohenfelde",
    ],
    "St. Georg": [
      "Hohenfelde",
      "Rotherbaum",
      "Eilbek",
      "Harvestehude",
      "Uhlenhorst",
    ],
    Hafencity: ["Rotherbaum", "Altona-Altstadt"],
    "Hamburg-Altstadt": ["Rotherbaum", "Sternschanze"],
    Hamm: [
      "Eilbek",
      "Marienthal",
      "Hohenfelde",
      "Wandsbek",
      "Barmbek-Süd",
      "Uhlenhorst",
    ],
    Hammerbrook: ["Hohenfelde", "Uhlenhorst", "Eilbek", "Rotherbaum"],
    Horn: [
      "Eilbek",
      "Marienthal",
      "Jenfeld",
      "Wandsbek",
      "Barmbek-Süd",
      "Tonndorf",
    ],
    Rothenburgsort: ["Moofleet"],
    Billstedt: [
      "Marienthal",
      "Jenfeld",
      "Wandsbek",
      "Barmbek-Süd",
      "Uhlenhorst",
      "Tonndorf",
      "Rahlstedt",
      "Lohbrügge",
      "Billweder",
    ],
    Billbrook: ["Lohbrügge", "Billweder", "Moofleet", "Allermöhe"],
    Lohbrügge: ["Billstedt", "Billbrook"],
    Billwerder: ["Billstedt", "Billbrook"],
    Moorfleet: ["Billbrook", "Billweder", "Rothenburgsort", "Veddel"],
    Tatenberg: ["Veddel", "Wilhelmsburg"],
    Spadenland: ["Veddel", "Wilhelmsburg"],
    Ochsenwerder: ["Wilhelmsburg"],
    Allermöhe: ["Billbrook"],
    Willhelmsburg: [
      "Spadenland",
      "Moofleet",
      "Ochsenwerder",
      "Tatenberg",
      "Neuland",
      "Harburg",
      "Moorburg",
      "Altenwerder",
      "Heimfeld",
    ],
    Steinwerder: ["Wilhelmsburg", "Altenwerder", "Altona-Altstadt"],
    Waltershof: ["Wilhelmsburg", "Altenwerder", "Francop"],
    Finkenwerder: ["Altenwerder", "Francop", "Neuenfelde"],
    Neuenfelde: ["Finkenwerder"],
    Francop: ["Finkenwerder", "Waltershof"],
    Altenwerder: ["Finkenwerder", "Waltershof", "Wilhelmsburg", "Steinwerder"],
    Moorburg: ["Wilhelmsburg"],
    Harburg: ["Wilhelmsburg"],
    Neuland: ["Wilhelmsburg"],
    Eilbek: [
      "Hohenfelde",
      "St. Georg",
      "Hamm",
      "Horn",
      "Barmbek-Süd",
      "Uhlenhorst",
      "Dulsberg",
      "Barmbek-Nord",
      "Winterhude",
    ],
    Marienthal: [
      "Hohenfelde",
      "Billstedt",
      "Hamm",
      "Horn",
      "Barmbek-Süd",
      "Uhlenhorst",
      "Dulsberg",
      "Barmbek-Nord",
      "Winterhude",
    ],
    Jenfeld: ["Billtedt", "Horn", "Dulsberg"],
    Wandsbek: [
      "Dulsberg",
      "Barmbek-Nord",
      "Winterhude",
      "Hohenfelde",
      "Billstedt",
      "Hamm",
      "Horn",
      "Barmbek-Süd",
      "Uhlenhorst",
    ],
    Bramfeld: [
      "Dulsberg",
      "Barmbek-Nord",
      "Winterhude",
      "Ohlsdorf",
      "Barmbek-Süd",
    ],
    Steilshoop: ["Barmbek-Nord", "Winterhude", "Ohlsdorf", "Dulsberg"],
    Wellingsbüttel: ["Ohlsdorf", "Fuhsbüttel"],
    Hummelsbüttel: ["Ohlsdorf", "Fuhsbüttel", "Langenhorn"],
    Langenhorn: ["Niendorf", "Hummelsbüttel", "Poppenbüttel"],
    Ohlsdorf: ["Steilshoop", "Bramfeld", "Wellingbüttel", "Hummelsbüttel"],
    "Barmbek-Nord": ["Eilbek", "Wandsbek", "Bramfeld", "Steilshoop", "Hamm"],
    "Barmbek-Süd": [
      "Eilbek",
      "Wandsbek",
      "Bramfeld",
      "Steilshoop",
      "Hamm",
      "Horn",
      "Borgfelde",
      "St. Georg",
    ],
    Uhlenhorst: [
      "Eilbek",
      "Wandsbek",
      "Hamm",
      "Borgfelde",
      "St. Georg",
      "Harvestehude",
    ],
    Hohenfelde: [
      "Eilbek",
      "Wandsbek",
      "Hamm",
      "Borgfelde",
      "St. Georg",
      "Hammerbrook",
      "Rotherbaum",
    ],
    Winterhude: [
      "Harvestehude",
      "Rotherbaum",
      "Hoheluft-West",
      "Lokstedt",
      "Eimsbüttel",
      "Sternschanze",
    ],
    Eppendorf: [
      "Hoheluft-West",
      "Rotherbaum",
      "Harvestehude",
      "Eimsbüttel",
      "Lokstedt",
      "Niendorf",
      "Stellingen",
    ],
    "Hoheluft-Ost": [
      "Hoheluft-West",
      "Rotherbaum",
      "Harvestehude",
      "Eimsbüttel",
      "Lokstedt",
      "Niendorf",
      "Stellingen",
      "Sternschanze",
    ],
    "Groß Borstel": [
      "Hoheluft-West",
      "Rotherbaum",
      "Harvestehude",
      "Stellingen",
      "Lokstedt",
      "Niendorf",
      "Eidelstedt",
    ],
    Fuhlsbüttel: [
      "Stellingen",
      "Lokstedt",
      "Niendorf",
      "Eidelstedt",
      "Schnelsen",
    ],
    Niendorf: ["Langenhorn", "Groß Borstel", "Eppendorf", "Fuhlsbüttel"],
    Schnelsen: ["Fuhlsbüttel"],
    Eidelstedt: ["Lurup", "Bahrenfeld"],
    Stellingen: [
      "Lurup",
      "Bahrenfeld",
      "Groß Borstel",
      "Eppendorf",
      "Fuhlsbüttel",
      "Altona-Nord",
      "Altona-Altstadt",
      "Sternschanze",
      "Hoheluft-Ost",
      "Ottensen",
    ],
    Ottensen: ["St. Pauli", "Eimsbütttel", "Stellingen"],
    Eimsbüttel: [
      "Altona-Nord",
      "Altona-Altstadt",
      "St. Pauli",
      "Sternschanze",
      "Hoheluft-Ost",
      "Eppendorf",
      "Ottensen",
    ],
    Rotherbaum: [
      "St. Georg",
      "Hohenfelde",
      "Winterhude",
      "Eppendorf",
      "Hoheluft-Ost",
      "St. Pauli",
      "Sternschanze",
      "Uhlenhorst",
      "Altona-Altstadt",
      "Hamburg-Altstadt",
      "Neustadt",
      "Hafencity",
      "Hammerbrook",
    ],
    Harvestehude: [
      "St. Georg",
      "Hohenfelde",
      "Winterhude",
      "Eppendorf",
      "Hoheluft-Ost",
      "St. Pauli",
      "Sternschanze",
      "Uhlenhorst",
      "Altona-Altstadt",
      "Hamburg-Altstadt",
      "Neustadt",
    ],
    Alsterdorf: ["Lokstedt", "Niendorf", "Steilshoop"],
    "Hoheluft-West": [
      "Hoheluft-Ost",
      "Eppendorf",
      "Sternschanze",
      "St. Pauli",
      "Altona-Altstadt",
      "Altona-Nord",
      "Bahrenfeld",
      "Neustadt",
    ],
  };

// SPIELPLATZ

export const ausruestungList = [
  "schatten",
  "sitzbänke",
  "picknick-tisch",
  "liegt im grünen",
  "toiletten",
  "grillplatz / feuerstelle",
];

export const ausstattung = [
  "liegt im grünen",
  "schatten",
  "sitzbänke",
  "unterfahrbare sitzgruppe",
  "picknick-tisch",
  "gastronomie / kiosk",
  "grillplatz / feuerstelle",
  "unterstand / schutzhütte",
  "parkplätze",
  "barrierefreies parken",
  "e-ladestation",
  "toiletten",
  "barrierefreies wc",
  "kostenpflichtig",
  "befahrbarer untergrund / fallschutzflächen",
  "tasthilfen / leitsysteme für menschen mit sehbehinderung",
  "einzelne spielstationen barrierefrei erreichbar",
  "kontrastreiche farbgestaltung",
  "kommunikationstafel / unterstützte kommunikation ",
];

export const mappingSpielgeraete: { [x: string]: iSpielgeräte } = {
  "klettergerät mit rutsche": "rutsche",
  doppelschaukel: "schaukel",
  reifenschaukel: "schaukel",
  sandfläche: "sandspielbereich",
  sandspielstation: "sandspielbereich",
  sandbagger: "sandspielbereich",
  "befahrbares bodentrampolin": "trampolin",
  seilkletterpyramide: "kletternetzpyramide",
  "wasserspiel / matschen": "wasserspiel",
  "balancier-element": "balancier-spiel",
};

export const spielgeraeteDisplay = {
  arrays: {
    rutsche: ["rutsche", "kleinkindrutsche", "röhrenrutsche"],
    schaukel: [
      "schaukel",
      "kleinkindschaukel",
      "nestschaukel",
      "schaukel mit fixiermöglichkeit",
    ],
    karussell: ["karussell", "inklusives karussell", "dreh-element"],
    kletterelement: ["kletterelement", "kletternetzpyramide", "kletterwand"],
  },
  singles: [
    "sandspielbereich",
    "wasserspiel",
    "wippe",
    "seilbahn",
    "trampolin",
    "reckstange",
  ],
  sport: [
    "basketballkorb",
    "volleyballnetz",
    "fußballtore",
    "tischtennisplatte",
    "skatepark",
    "kinderfahrrad/roller geeignet",
  ],
};

export const spielgeraeteList = [
  "rutsche",
  "kleinkindrutsche",
  "röhrenrutsche",
  "schaukel",
  "kleinkindschaukel",
  "nestschaukel",
  "schaukel mit fixiermöglichkeit",
  "sandspielbereich",
  "wasserspiel",
  "wippe",
  "karussell",
  "inklusives karussell",
  "dreh-element",
  "seilbahn",
  "trampolin",
  "kletterelement",
  "kletternetzpyramide",
  "kletterwand",
  "reckstange",
  "basketballkorb",
  "volleyballnetz",
  "fußballtore",
  "tischtennisplatte",
  "skatepark",
  "kinderfahrrad/roller geignet",
];

export const spType = [
  "indoor",
  "outdoor",
  "abenteuerspielplatz",
  "tierpark",
  "waldspielplatz",
  "planschbecken",
  "wasserspielplatz",
  "skatepark",
];
