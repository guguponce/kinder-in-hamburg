import PageTitle from "@components/PageTitle";
import React from "react";
import { getPostsWithTag } from "@app/api/dbActions";
import { unstable_cache } from "next/cache";
import BezirkableList from "@components/BezirkableList";
import { Metadata } from "next";
import BuecherHalleMap from "./BuecherHalleMap";
import { cn } from "@app/utils/functions";

const getBuecherhallenPosts = unstable_cache(
  async () => {
    const posts = await getPostsWithTag(
      ["buecherhalle"],
      // -----------------------------
      "kih-approved-blogposts"
    );
    return posts;
  },
  ["buecherhallenPosts", "posts"],
  {
    revalidate: 600,
  }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Bücherhallen | Kinder in Hamburg",
    icons: "/favicon.ico",
    description:
      "Entdecke die Bücherhallen in Hamburg, ein Ort voller Bücher, Veranstaltungen und Aktivitäten für Kinder und die ganze Familie. Hier findest du alles von klassischen Literaturangeboten bis hin zu interaktiven Lesestunden für Kinder.",
    keywords: [
      "hamburg bücherhallen",
      "bücherhallen hamburg",
      "bibliothek hamburg",
      "kinderbibliothek hamburg",
      "bücher für kinder",
      "familienaktivitäten hamburg",
      "bücher in hamburg",
      "kinderbibliotheken hamburg",
      "lesestunden hamburg",
      "verlosungen hamburg",
      "familienzeit hamburg",
      "kinderliteratur hamburg",
      "hamburg bücher",
      "leseaktivitäten hamburg",
      "buecherhalle hamburg",
      "buecherhallen hamburg",
      "buecherhalle hamburg kinder",
      "buecherhallen für kinder",
    ],
    openGraph: {
      title: "Bücherhallen Hamburg - Entdecke Bücher für die Familie",
      description:
        "Entdecke die Bücherhallen in Hamburg, ein Ort voller Bücher, Veranstaltungen und Aktivitäten für die ganze Familie. Hier findest du alles von klassischen Literaturangeboten bis hin zu interaktiven Lesestunden für Kinder.",
      url: "https://www.kinder-in-hamburg.de/bücherhallen",
      images: `${process.env.BASE_URL}opengraph-image.png`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Bücherhallen Hamburg - Entdecke Bücher für die Familie",
      description:
        "Entdecke die Bücherhallen in Hamburg, ein Ort voller Bücher, Veranstaltungen und Aktivitäten für die ganze Familie. Hier findest du alles von klassischen Literaturangeboten bis hin zu interaktiven Lesestunden für Kinder.",
      images: `${process.env.BASE_URL}opengraph-image.png`,
    },
  };
}

const images = [
  { title: "Bücher", src: "/assets/icons/buch.svg" },
  { title: "Musik", src: "/assets/icons/musik.svg" },
  { title: "Filme", src: "/assets/icons/film.svg" },
  { title: "Brettspiele", src: "/assets/icons/brettspiel.svg" },
  { title: "E-Books", src: "/assets/icons/ebook.svg" },
  { title: "Spielekonsolen", src: "/assets/icons/spielkonsole.svg" },
  { title: "Hörbücher", src: "/assets/icons/hoerbuch.svg" },
];
const Paragraph = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <p className={cn("w-full max-w-[800px]", className)}>{children}</p>;

export default async function BuecherhallenPage() {
  const buecherhallenPosts = ((await getBuecherhallenPosts()) || [])
    //sort posts with image first
    .sort((a, b) => {
      if (a.image?.[0] && !b.image?.[0]) return -1;
      if (!a.image?.[0] && b.image?.[0]) return 1;
      return 0;
    });

  return (
    <main className="w-full max-w-[1200px] flex flex-col items-center gap-2 xs:px-2 pb-4">
      <PageTitle
        title="Bücherhallen"
        className="text-left w-full max-w-[800px]"
      />

      <article className="w-fit max-w-full flex flex-col italic items-center gap-2 text-white bg-hh-600 bg-opacity-50 rounded-lg px-2 sm:px-4">
        <Paragraph>
          Tausende Geschichten und ebenso viele Heldinnen und Helden von
          Abenteuern für Jung und Alt lassen sich entdecken, wenn man in die
          zahlreichen{" "}
          <span className="font-bold text-white">Bücherhallen Hamburgs</span>{" "}
          eintaucht.
        </Paragraph>
        <Paragraph>
          Die Stadt verfügt über ein reichhaltiges Netz städtischer Bibliotheken
          mit{" "}
          <span className="font-bold text-white">
            über 30 Filialen und zwei Bücherbussen
          </span>
          . Jede von ihnen bietet einen eigenen{" "}
          <span className="font-bold text-white">Kinderbereich</span>, in dem
          Kinder und Jugendliche verschiedene Medien entdecken können, die
          sowohl das Lernen als auch die Freizeitgestaltung fördern. Die größte
          Kinderbibliothek Hamburgs ist die{" "}
          <span className="font-bold text-white">Kibi</span>, die Teil der
          Zentralbibliothek ist und eine riesige Auswahl an Materialien bietet –
          zum Entdecken vor Ort oder zum Ausleihen.
        </Paragraph>
      </article>
      <BuecherHalleMap buecherhallenPosts={buecherhallenPosts} />
      <div className="w-full flex justify-center flex-wrap items-stretch gap-2 ">
        <div className="flex-grow max-w-[800px] xl:max-w-[720px] italic text-white bg-hh-700 bg-opacity-35 rounded-lg p-2 sm:p-4">
          <img
            src="/assets/Lese.png"
            alt="Bücherhallen"
            className="float-left max-w-[40%] max-h-[180px]"
            style={{
              shapeOutside: "url(/assets/Lese.png)",
            }}
          />
          <Paragraph className="pb-1 md:pb-2">
            Ein Besuch in der Bibliothek kann schnell zur wöchentlichen
            <span className="font-bold text-white">
              {" "}
              Familientradition
            </span>{" "}
            werden – mit gemütlichen
            <span className="font-bold text-white"> Leseecken</span>, einer
            schier
            <span className="font-bold text-white">
              {" "}
              unendlichen Auswahl
            </span>{" "}
            und{" "}
            <span className="font-bold text-white">
              etwas Passendem für jeden Geschmack.
            </span>
          </Paragraph>
          <Paragraph className="pb-1 md:pb-2">
            Die Bücherhallen sind
            <span className="font-bold text-white">
              {" "}
              nicht nur etwas für Leseratten
            </span>
            . Vielleicht entdeckt man die Freude am Lesen zwischen Pippi
            Langstrumpf, Harry Potter und dem neuesten Wii-Spiel – oder beim
            Ausleihen eines Films für den nächsten Familienfilmabend.
            <br />
            <span className="font-bold text-white">
              {" "}
              Hörbücher, Filme, Spiele und sogar Konsolen
            </span>{" "}
            kann man vor Ort ausleihen – ebenso wie CDs und coole
            Vintage-Schallplatten. Über die
            <span className="font-bold text-white"> eBücherhalle</span> lassen
            sich Bücher, Filme, Musik und mehr streamen. Und wer Ruhe zum Lernen
            braucht, findet
            <span className="font-bold text-white">
              {" "}
              Arbeitsplätze mit WLAN.
            </span>
          </Paragraph>
          <div className="w-full max-w-full overflow-hidden mx-auto my-2">
            <div className="max-w-[90%] sm:max-w-full flex gap-4 sm:gap-8 animate-scroll hover:[animation-play-state:paused]">
              {[...images, ...images, ...images].map(
                ({ src, title }, index) => {
                  return (
                    <img
                      key={index}
                      src={src}
                      alt={`Image ${index}`}
                      title={title}
                      className="h-16 w-auto object-cover flex-shrink-0"
                    />
                  );
                }
              )}
            </div>
          </div>
        </div>
        <div className="w-full max-w-[800px] xl:max-w-[380px] italic text-white bg-hh-700 bg-opacity-50 xl:bg-opacity-35 rounded-lg p-2 sm:p-4">
          <h3 className="font-extrabold text-hh-50 text-lg">
            Veranstaltungen für Kinder und Jugendliche
          </h3>
          <Paragraph className="pb-1 md:pb-2">
            Jede Bücherhalle bietet ein{" "}
            <span className="font-bold text-white">
              abwechslungsreiches Programm
            </span>{" "}
            – lehrreich und unterhaltsam zugleich. Dazu gehören Veranstaltungen,
            sowie:{" "}
            <span className="font-bold text-white">
              Vorlesen, Kamishibai, LEGO®-Nachmittage, Berufsorientierung,
              kreatives Schreiben und Filmprojekte
            </span>
            .<br />
            Auch Ehrenamtliche Projekte finden statt:{" "}
            <span className="font-bold text-white">
              Lesetraining für Grundschulkinder
            </span>{" "}
            oder im <span className="font-bold text-white">CoderDojo</span>, wo
            Jugendlichen Programmieren lernen können.
          </Paragraph>
          <section className="w-full italic text-white  bg-hh-800 bg-opacity-50 xl:bg-opacity-35 rounded-lg p-2 sm:p-4">
            <Paragraph className="">
              Mehr Informationen über die Bücherhallen und ihre Angebote unter:
              <br />
              <a
                href="https://www.buecherhallen.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-hh-50 font-bold hover:text-hh-100"
              >
                https://www.buecherhallen.de/
              </a>
            </Paragraph>
          </section>
        </div>
      </div>

      <BezirkableList
        list={buecherhallenPosts}
        type="posts"
        variant="transparent-light"
        cardType="horizontal"
        containerClassname="min-h-fit py-1 md:py-8"
      />
      <section className="w-fit max-w-[800px] flex flex-col sm:grid sm:grid-cols-2  gap-2 items-stretch flex-wrap italic text-hh-800">
        <article className="bg-hh-400 p-2 rounded">
          <Paragraph>
            <span className="font-extrabold">Gebühren</span> für die
            Bücherhallen-Karte (2025):
          </Paragraph>
          <Paragraph>
            <span className="font-bold text-white">
              · Für Kinder bis 8 Jahre:
            </span>{" "}
            <span className="font-semibold">5 € bar</span> oder{" "}
            <span className="font-semibold">3 € per Lastschrift</span> jährlich
          </Paragraph>
          <Paragraph>
            <span className="font-bold text-white">
              · Für Kinder + Jugendliche 9-17 Jahre:
            </span>{" "}
            <span className="font-semibold">10 € bar</span> oder{" "}
            <span className="font-semibold">8 € per Lastschrift </span>
            jährlich
          </Paragraph>
          <Paragraph>
            <span className="font-bold text-white">
              · Für junge Erwachsene (18-26 Jahre):
            </span>{" "}
            <span className="font-semibold">23 € bar</span> oder{" "}
            <span className="font-semibold">18 € per Lastschrift</span> jährlich
          </Paragraph>
          <Paragraph>
            <span className="font-bold text-white">
              · Kostenlos für alle bis 17 Jahre mit Berechtigung nach dem
              Bildungs- und Teilhabepaket
            </span>{" "}
          </Paragraph>
        </article>{" "}
        <article className="bg-hh-400 p-2 rounded">
          Zur{" "}
          <span className="font-extrabold">Anmeldung in der Bücherhalle</span>{" "}
          benötigt man:
          <Paragraph className="pb-0">
            <span className="font-bold text-white">
              · Ausweisdokument, ggf. mit Meldebestätigung
            </span>
          </Paragraph>
          <Paragraph>
            <span className="font-bold text-white">
              · Einwilligung der Erziehungsberechtigten oder einer
              bevollmächtigten Person
            </span>
            : Bei Kindern bis 16 Jahren.
          </Paragraph>
        </article>
      </section>

      {/* <p>
        Die Bücherhallen Hamburg sind die öffentlichen Bibliotheken der Freien
        und Hansestadt Hamburg. Sie sind eine der größten Bibliotheken
        Deutschlands und bieten ein umfangreiches Angebot an Medien und
        Veranstaltungen für alle Altersgruppen.
      </p>
      <p>
        Die Bücherhallen Hamburg sind in ganz Hamburg verteilt und bieten neben
        der Ausleihe von Büchern, Zeitschriften, CDs und DVDs auch viele weitere
        Services an. Dazu gehören unter anderem Lesungen, Workshops,
        Ausstellungen und Führungen.
      </p>
      <p>
        Die Bücherhallen Hamburg sind ein wichtiger Bestandteil des kulturellen
        Lebens in Hamburg und bieten allen Bürgerinnen und Bürgern die
        Möglichkeit, sich zu informieren, zu bilden und zu unterhalten.
        Zur Anmeldung in der Bücherhalle benötigen Erwachsene ein gültiges Ausweisdokument, ggf. mit Meldebestätigung. Die Gebühr beträgt 1,00 Euro plus Servicekosten. Kinder bis 16 brauchen zusätzlich eine schriftliche Einwilligung der Erziehungsberechtigten oder einer bevollmächtigten Person.
      </p> */}
    </main>
  );
}
