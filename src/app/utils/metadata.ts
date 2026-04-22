import { Metadata } from "next";

type MetadataInput = {
  title: string;
  description: string;
  image?: string;
  bezirk?: string;
  stadtteil?: string;
  pathname: string;
  robots?: boolean;
  keywords?: string[];
};

export function createMetadata({
  title,
  description,
  image,
  bezirk,
  stadtteil,
  pathname,
  robots,
  keywords,
}: MetadataInput): Metadata {
  const baseUrl = process.env.BASE_URL || "";
  const fallbackImage = `${baseUrl}/opengraph-image.png`;

  const location = [stadtteil, bezirk].filter(Boolean).join(", ");
  const fullTitle = location ? `${title} – ${location}` : title;

  const imageUrl = image || fallbackImage;
  const siteName = "Kinder in Hamburg";
  const fullUrl = "https://www.kinder-in-hamburg.de" + pathname;
  return {
    metadataBase: new URL(baseUrl),

    title: fullTitle,
    description,
    icons: "/favicon.ico",

    alternates: {
      canonical: fullUrl,
    },

    robots: {
      index: !!robots,
      follow: !!robots,
    },

    keywords,

    authors: [{ name: siteName }],
    creator: siteName,

    openGraph: {
      type: "website",
      url: fullUrl,
      title: fullTitle,
      description,
      siteName,
      locale: "de_DE",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description,
      creator: siteName,
      site: baseUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
        },
      ],
    },
  };
}

export const spielplaetzeMetadata = [
  "Spielplätze Hamburg",
  "Spielplatz Hamburg",
  "Spielplätze in Hamburg",
  "Spielplatz in der Nähe Hamburg",
  "beste Spielplätze Hamburg",
  "Kinder Spielplätze Hamburg",
  "Ausflugsziele Spielplatz Hamburg",
  "Outdoor Spielplatz Hamburg",
  "Indoor Spielplatz Hamburg",
  "Abenteuerspielplatz Hamburg",
  "Waldspielplatz Hamburg",
  "Wasserspielplatz Hamburg",
  "Planschbecken Hamburg",
  "Skatepark Hamburg",
  "Sportplatz für Kinder Hamburg",
  "Tierpark für Kinder Hamburg",
  "Abenteuerspielplätze für Kinder",
  "Natur Spielplätze",
  "Wald Spielplätze für Kinder",
  "Wasser Spielplätze für Kinder",
  "Spielplätze mit Wasser Hamburg",
  "Spielplätze mit Schatten Hamburg",
  "ruhige Spielplätze Hamburg",
  "große Spielplätze Hamburg",
  "kleinkind Spielplätze Hamburg",
  "Spielplätze für kleine Kinder",
  "was sind die besten Spielplätze in Hamburg",
  "schöne Spielplätze für Kinder in Hamburg",
  "Spielplätze zum Ausfliegen Hamburg",
  "wo gibt es Spielplätze in Hamburg",
  "Kinder Ausflüge Spielplatz Hamburg",
  "Wochenend Ausflug Spielplatz Hamburg",
  "Spielplätze für Familien Hamburg",
];

export const postsMetadata = [
  "Kinder Aktivitäten",
  "Familien Aktivitäten",
  "Ausflüge mit Kindern",
  "Freizeit mit Kindern",
  "Was tun mit Kindern",
  "Aktivitäten für Teenager",
  "Jugend Aktivitäten",
  "Indoor Aktivitäten Kinder",
  "Outdoor Aktivitäten Kinder",
  "kostenlose Aktivitäten Kinder",
  "Wochenend Ausflüge Familie",
  "Spielplätze",
  "Museen für Kinder",
  "Tiere erleben Kinder",
  "Sport Aktivitäten Kinder",
  "Kindergeburtstag Ideen",
  "Kinder Café",
  "Indoor Spielhaus",
  "Badeplätze mit Kindern",
  "Freizeit Ideen Familie Wochenende",
  "Badeplätze Hamburg",
  "Kinder Aktivitäten Hamburg",
  "Familien Aktivitäten Hamburg",
  "Ausflüge mit Kindern Hamburg",
  "Freizeit mit Kindern Hamburg",
  "Spielplätze Hamburg",
  "Museen für Kinder Hamburg",
  "Indoor Aktivitäten Hamburg",
  "Outdoor Aktivitäten Hamburg",
  "kostenlose Aktivitäten Hamburg",
  "Wochenend Ausflüge Hamburg",
  "Kindergeburtstag Hamburg",
  "Ausflugsziele Hamburg mit Kindern",
  "Dinge für Kinder in Hamburg",
  "was tun mit Kindern in Hamburg",
  "Freizeit Hamburg Kinder",
  "Freizeit Ideen Familie Wochenende",
  "kids activities hamburg",
  "things to do with kids hamburg",
  "family activities hamburg",
  "things to do in Hamburg with kids",
  "free things to do with kids hamburg",
  "playgrounds near me hamburg",
  "family weekend activities hamburg",
];

export const singleFlohmarktMetadata = [
  "Flohmarkt in Hamburg",
  "Flohmarkt Hamburg",
  "Flohmärkte Hamburg",
  "Trödelmarkt Hamburg",
  "Flohmarkt Schleswig-Holstein",
  "Flohmarkt in der Nähe",
  "Flohmarkt heute Hamburg",
  "Flohmarkt dieses Wochenende Hamburg",
  "Flohmarkt Termine Hamburg",
  "Flohmarkt Öffnungszeiten Hamburg",
  "Flohmarkt Datum Hamburg",
  "Flohmarkt Standort Hamburg",
  "Flohmarkt Adresse Hamburg",
  "wann ist Flohmarkt in Hamburg",
  "wo ist Flohmarkt in Hamburg",
  "welcher Flohmarkt ist heute in Hamburg",
  "Flohmarkt am Wochenende Hamburg",
  "beste Flohmärkte in Hamburg",
  "Familien Flohmarkt Hamburg",
  "Kinder Flohmarkt Hamburg",
  "Outdoor Flohmarkt Hamburg",
  "Indoor Flohmarkt Hamburg",
  "Flohmarkt Veranstaltung Hamburg",
  "Flohmarkt Event Hamburg",
  "Antik und Trödel Hamburg",
  "Second Hand Markt Hamburg",
  "Flohmarkt besuchen Hamburg",
  "Flohmarkt Tipps Hamburg",
  "Flohmarkt in Hamburg heute geöffnet",
  "Flohmarkt planen Hamburg",
];

export const flohmaerkteMetadata = [
  "Flohmärkte Hamburg",
  "Flohmarkt Hamburg",
  "Kinder Flohmarkt Hamburg",
  "Baby Flohmarkt Hamburg",
  "Familien Flohmarkt Hamburg",
  "Flohmarkt für Kinder Hamburg",
  "Spielzeug Flohmarkt Hamburg",
  "Kinderbasar Hamburg",
  "Babybasar Hamburg",
  "Kindersachen Flohmarkt Hamburg",
  "Flohmarkt Kinderkleidung Hamburg",
  "Second Hand Kinder Hamburg",
  "Kinderkleidung Flohmarkt Hamburg",
  "Flohmarkt Spielzeug gebraucht Hamburg",
  "Flohmarkt heute Hamburg",
  "Flohmarkt Wochenende Hamburg",
  "Flohmarkt Termine Hamburg",
  "Flohmarkt in der Nähe Hamburg",
  "Flohmarkt Hamburg Sonntag",
  "Familienmarkt Hamburg",
  "Baby Sachen gebraucht Hamburg",
  "Kinder Sachen günstig Hamburg",
  "Tauschmarkt Kinder Hamburg",
  "Flohmarkt Schule Kindergarten Hamburg",
  "Kinderflohmarkt Schleswig-Holstein",
  "Flohmarkt für Familien Schleswig-Holstein",
  "Babyartikel Flohmarkt Hamburg",
  "Kinderbedarf Flohmarkt Hamburg",
  "Flohmarkt Outdoor Kinder Hamburg",
  "Kinder Events Hamburg Flohmarkt",
  "Flohmarkt für Eltern Hamburg",
];

export const eventsMetadata = [
  "Events Hamburg Kinder",
  "Veranstaltungen Hamburg Familien",
  "Kinder Events Hamburg",
  "Familien Events Hamburg",
  "Events für Kinder Hamburg",
  "Freizeit Events Hamburg Kinder",
  "Wochenend Events Hamburg Familien",
  "Events heute Hamburg Kinder",
  "Events Wochenende Hamburg Familien",
  "Kinderprogramm Hamburg",
  "Familienprogramm Hamburg",
  "Veranstaltungen für Kinder heute Hamburg",
  "Kinder Veranstaltungen Wochenende Hamburg",
  "Events in der Nähe Hamburg Kinder",
  "Familien Aktivitäten Hamburg Events",

  "Laternelauf Hamburg",
  "Laternelauf Kinder Hamburg",
  "Laternenumzug Hamburg",
  "Laternenumzug Kinder Hamburg",
  "Laternenfest Hamburg",
  "Laternen basteln Hamburg",
  "Laternenwerkstatt Hamburg",
  "Laternen basteln Kinder Hamburg",

  "Adventsevent Hamburg",
  "Adventsveranstaltungen Hamburg Kinder",
  "Advent für Kinder Hamburg",
  "Adventsprogramm Hamburg Familien",
  "Weihnachtsmarkt Hamburg Kinder",
  "Weihnachtsmarkt Familie Hamburg",
  "Weihnachtsmarkt mit Kindern Hamburg",
  "Kinderprogramm Weihnachtsmarkt Hamburg",
  "Winter Events Hamburg Kinder",

  "Sommerfest Hamburg Kinder",
  "Straßenfest Hamburg Kinder",
  "Stadtteilfest Hamburg Familien",
  "Familienfest Hamburg",
  "Kinderfest Hamburg",
  "Mitmachaktionen Kinder Hamburg",
  "Bastel Events Kinder Hamburg",
  "Outdoor Events Kinder Hamburg",
  "Indoor Events Kinder Hamburg",
];
