import React from "react";

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center gap-4 p-1">
      <section
        id="about"
        className="p-4 w-full sm:w-4/5 md:w-3/4 max-w-[800px] rounded-lg shadow-lg bg-gradient-to-b from-hh-800 to-hh-600 text-white flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold">Über uns</h1>
        <h3 className="font-semibold">
          Herzlich willkommen bei Kinder in Hamburg!
        </h3>
        <p>
          Hier findet ihr Flohmärkten aus verschiedenen Teilen der Stadt
          zusammengestellt.
        </p>
        <p>
          Wenn ihr einen kennt, der hier nicht aufgeführt ist, könnt ihr ihn
          gerne per{" "}
          <a
            href="mailto:admin@kinder-in-hamburg.de"
            className="w-fit underline underline-offset-4 text-negative-100 font-bold"
          >
            E-Mail
          </a>{" "}
          vorschlagen. (Bald könnt ihr sie auch direkt auf dieser Seite
          hochladen, wenn ihr wollt). Wir freuen uns auch über Empfehlungen oder
          Links zu WhatsApp-Gruppen, um mehr Märkte zu entdecken.
        </p>
        <p>
          Wir wollen euch helfen, euren nächsten Flohmarkt zu finden, und bald
          auch eure nächsten Familienausflüge in Hamburg.
          {/* Einen schönen Tag euch allen! */}
        </p>{" "}
        <p>
          Vielen Dank, dass ihr unsere Website besucht und mit uns auf dieses
          Abenteuer geht.
        </p>
      </section>
      <section
        id="future"
        className="p-4 lg:p-8  w-full max-w-[1200px] shadow-lg bg-gradient-to-b from-hh-100 to-hh-50 text-white flex flex-col gap-4"
      >
        <h3 className="font-bold text-xl text-hh-800">
          Willkommen in der Zukunft unserer App!
        </h3>
        <p className="text-hh-800">
          Hier ist eine kurze Liste einiger bevorstehender Funktionen, die dein
          Erlebnis noch bereichernder und angenehmer machen werden:
        </p>
        <ul>
          <li className="my-1 rounded p-1 bg-hh-800">
            <span className="font-semibold text-lg text-positive-200">
              Posts:
            </span>{" "}
            Beiträge von Orten, die wir im Laufe der Jahre erkundet haben oder
            die von Freunden empfohlen wurden, um authentische Einblicke und
            echte Erfahrungen zu bieten. Und auch von kuratierten Empfehlungen
            und Inspirationen, die aus verschiedenen Internetseiten und
            Influencern stammen.
          </li>
          <li className="my-1 rounded p-1 bg-hh-800">
            <span className="font-semibold text-lg text-positive-200">
              Kategorien und Standortorganisation:
            </span>{" "}
            Navigiere problemlos durch verschiedene Kategorien von Beiträgen und
            Bezirken.
          </li>
          <li className="my-1 rounded p-1 bg-hh-800">
            <span className="font-semibold text-lg text-positive-200">
              Erweiterte Filterung:
            </span>{" "}
            Passe deine Suche nach Standort, Kategorien und empfohlenem Alter
            an, um sicherzustellen, dass der Inhalt deinen Vorlieben und
            Interessen entspricht.
          </li>
          <li className="my-1 rounded p-1 bg-hh-800">
            <span className="font-semibold text-lg text-positive-200">
              Neue Orte und Flohmärkte vorschlagen:
            </span>{" "}
            Du kannst deine Lieblingsflohmärkte und familienfreundlichen Orte
            über unsere Vorschlagsformulare teilen, um das kollektive Wissen
            unserer Community zu erweitern.
          </li>
          <li className="my-1 rounded p-1 bg-hh-800">
            <span className="font-semibold text-lg text-positive-200">
              Spielplatz-Erkundung:
            </span>{" "}
            Tauche ein in die Welt der Spielplätze in Hamburg, mit umfassender
            Abdeckung der besten in jedem Stadtviertel, perfekt für endlosen
            Spaß mit deinen Kindern.
          </li>
          <li className="my-1 rounded p-1 bg-hh-800">
            <span className="font-semibold text-lg text-positive-200">
              Interaktive Karten:
            </span>{" "}
            Wir werden versuchen, eine Karte mit den Standorten der Orte der
            Beiträge in jedem Bezirk zu erstellen.
          </li>
          <li className="my-1 rounded p-1 bg-hh-800">
            <span className="font-semibold text-lg text-positive-200">
              Persönliche Erfahrung:
            </span>{" "}
            Genieße eine personalisierte Erfahrung mit Login-Optionen, mit denen
            du deine Lieblingsbeiträge speichern und Updates zu kommenden
            Flohmärkten erhalten kannst, sowie deine Vorschläge verfolgen
            kannst.
          </li>
        </ul>

        <h3 className="font-bold text-xl mt-2 text-hh-800">Einschränkungen:</h3>
        <ul>
          <li className="my-1 rounded p-1 bg-hh-800">
            <span className="font-semibold text-lg text-negative-200">
              Bildrechte:
            </span>{" "}
            Aufgrund von Urheberrechtsbeschränkungen werden wir schrittweise
            Bilder zu Beiträgen hinzufügen, während wir sie vor Ort aufnehmen.
            Wir schätzen jegliche Beiträge von DEINEN eigenen Fotos sehr und
            werden die Eigentümer entsprechend nennen. Wenn du daran
            interessiert bist, deine Instagram-Bilder zu teilen, würden wir uns
            freuen, dein Konto auf unserer Website zu bewerben.
          </li>
          <li className="my-1 rounded p-1 bg-hh-800">
            <span className="font-semibold text-lg text-negative-200">
              Web-Wartungskosten:
            </span>{" "}
            Wenn wir den Punkt erreichen, an dem viele Menschen die Website
            nutzen, müssen wir einen Weg finden, sie zu warten. Einige Ideen
            sind kleine Spenden von den Benutzern, kostenpflichtige
            Premium-Konten, um auf einige Funktionen zuzugreifen, oder Werbung
            auf der Website.
          </li>
          <li className="my-1 rounded p-1 bg-hh-800">
            <span className="font-semibold text-lg text-negative-200">
              Zeitaufwand:
            </span>{" "}
            Als Eltern verstehen wir die Herausforderungen bei der
            Aufrechterhaltung persönlicher Projekte. Sei versichert, dass wir
            unser Bestes geben werden, um diese Plattform lebendig und aktiv zu
            halten, sowohl für dich als auch für andere Familien, die neue
            Abenteuer suchen.
          </li>
        </ul>

        <p className="text-hh-800">
          Dies ist die Art von Website, die wir als frische Eltern geliebt
          hätten, um neue schöne Erfahrungen mit unseren Kindern zu machen, aber
          es ist auch eine, die wir persönlich jede Woche nutzen werden, um die
          Frage zu beantworten:{" "}
          <span className="font-semibold text-lg text-hh-950">
            Was machen wir heute?
          </span>
        </p>
      </section>
    </main>
  );
}

{
  /* <p>
Herzlich willkommen bei{" "}
<span className="font-semibold">Kinder in Hamburg</span>! Hier seid
ihr richtig, wenn ihr nach familienfreundlichen Aktivitäten in Hamburg
sucht. Unsere Website dreht sich darum, gemeinsam mit euren Kleinen
die Stadt zu erkunden und neue und aufregende Dinge zu entdecken.
</p>
<p>
Wir sind Eltern, die es lieben, mit ihren Kindern verschiedene Orte
dieser Stadt zu erforschen. Wir finden, dass Hamburg für Familien{" "}
<span className="font-semibold">einfach mega viel zu bieten hat</span>
, und wir möchten verschiedene Optionen für euer nächstes Abenteuer
mit euren Kids <span className="font-semibold">teilen</span>.
</p>
<p>
Wir wissen, wie{" "}
<span className="font-semibold">
  knifflig es sein kann, für jede Woche (oder sogar jeden Tag) neue
  Aktivitäten
</span>{" "}
zu finden. Deshalb haben wir diese Website erstellt, um euch dabei zu{" "}
<span className="font-semibold">helfen</span>. Unser Ziel ist es, mit
euch verschiedene Locations zu{" "}
<span className="font-semibold">teilen</span>, die wir selbst besucht
haben oder über die wir ein bisschen was wissen, damit ihr eure Zeit
in Hamburg <span className="font-semibold">voll auskosten könnt</span>
. Egal, ob ihr hier{" "}
<span className="font-semibold">
  lokale Profis oder neue Besucher
</span>{" "}
seid, wir hoffen, dass unsere Beiträge euch dazu{" "}
<span className="font-semibold">
  inspirieren, etwas Neues auszuprobieren
</span>{" "}
und{" "}
<span className="font-semibold">
  unvergessliche Momente mit euren Kids zu erleben
</span>
.
</p>
<p>
Vom{" "}
<span className="font-semibold">Erkunden von Museen und Parks</span>{" "}
bis hin zum Testen von{" "}
<span className="font-semibold">coolen Restaurants</span> und dem
Besuch von <span className="font-semibold">Flohmärkten</span> – wir
haben alles im Blick! Wir werden ständig neue Optionen hinzufügen,
also schaut immer mal wieder vorbei!
</p> */
}

{
  /* <p>
Welcome to <span className="font-semibold">Kinder in Hamburg</span>,
your go-to source for{" "}
<span className="font-semibold">family-friendly activities</span> in
Hamburg. Our website is all about{" "}
<span className="font-semibold">exploring the city</span> with your
little ones and{" "}
<span className="font-semibold">
  discovering new and exciting things
</span>{" "}
to do together.
</p>
<p>
We are parents who love{" "}
<span className="font-semibold">exploring with their children</span>{" "}
different places of this city. We feel that Hamburg has{" "}
<span className="font-semibold">so much to offer for families</span>,
and we want to{" "}
<span className="font-semibold">share different options</span> for your
next <span className="font-semibold">experience with your kids</span>.
</p>
<p>
We know how{" "}
<span className="font-semibold">
  challenging it can be to find different activities
</span>{" "}
for every week (or even every day!), so we created this site to{" "}
<span className="font-semibold">help you search for them</span>. Our{" "}
<span className="font-semibold">
  goal is to share with you different locations
</span>{" "}
that we have visited or that whe know a bit about, so that you can{" "}
<span className="font-semibold">
  make the most of your time in Hamburg
</span>
. Whether you&#39;re a{" "}
<span className="font-semibold">local or a visitor</span>, we hope our
posts will{" "}
<span className="font-semibold">inspire you to try something new</span>{" "}
and{" "}
<span className="font-semibold">
  make lasting memories with your children
</span>
.
</p>
<p>
From <span className="font-semibold">exploring museums and parks</span>,
to trying <span className="font-semibold">new restaurants</span> and
attending <span className="font-semibold">flea markets</span>, we will
try to <span className="font-semibold">cover it all</span>. We will try
to <span className="font-semibold">add more and more options</span>{" "}
every week!
</p>
<p>
Thank you for <span className="font-semibold">visiting our site</span>{" "}
and <span className="font-semibold">joining us on this adventure</span>.
We hope to see you and your little ones{" "}
<span className="font-semibold">exploring Hamburg soon</span>!
</p> */
}
