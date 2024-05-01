import Link from "next/link";
import React from "react";

export default function ShortAbout() {
  return (
    <article className="p-4 w-full sm:w-4/5 md:w-3/4 max-w-[600px] rounded-lg shadow-lg bg-hh-800 bg-opacity-50 text-white flex flex-col gap-4">
      <h3 className="font-semibold">
        Herzlich willkommen bei Kinder in Hamburg!
      </h3>
      <p>
        Hier findet ihr Flohmärkten aus verschiedenen Teilen der Stadt
        zusammengestellt.
      </p>
      <p>
        Wenn ihr einen kennt, der hier nicht aufgeführt ist, könnt ihr ihn gerne
        per{" "}
        <a
          href="mailto:admin@kinder-in-hamburg.de"
          className="w-fit underline underline-offset-4 text-negative-100 font-bold"
        >
          E-Mail
        </a>{" "}
        vorschlagen. (Bald könnt ihr sie auch direkt auf dieser Seite hochladen,
        wenn ihr wollt). Wir freuen uns auch über Empfehlungen oder Links zu
        WhatsApp-Gruppen, um mehr Märkte zu entdecken.
      </p>
      <p>
        Wir wollen euch helfen, euren nächsten Flohmarkt zu finden, und bald
        auch eure nächsten Familienausflüge in Hamburg.
        {/* Einen schönen Tag euch allen! */}
      </p>
      {/* <p>
        Entdeckt mit uns familienfreundliche Aktivitäten in der Stadt. Von
        Museen und Parks bis hin zu Restaurants und Flohmärkten - wir versuchen
        alles abzudecken.
      </p>
      <p>
        Als Eltern mögen wir es selbst nicht, Zeit damit zu verschwenden, auf
        Instagram zu scrollen oder auf verschiedenen Websites nach der perfekten
        Aktivität für unsere Kinder zu suchen. Deshalb haben wir diese Website
        erstellt, um praktische Filter und Kategorien anzubieten, um die idealen
        Aktivitäten schnell zu finden.
      </p> */}
      {/* <p>
        Wir hoffen, dass wir Menschen mit Kindern inspirieren können, ihr
        nächstes Erlebnis in Hamburg zu finden.
      </p> */}
      <p>Viel Spaß dabei!</p>

      <Link
        href={"/about"}
        className="self-end font-semibold italic underline underline-offset-4 w-fit"
      >
        Mehr lesen
      </Link>
    </article>
  );
}

{
  /* <h3 className="font-semibold">Welcome to Kinder in Hamburg!</h3>
<p>
  Discover family-friendly activities in the city with us. From museums
  and parks to restaurants and flea markets - we will try to cover it all.
</p>
<p>
  As parents ourselves, we do not like wasting time scrolling through
  Instagram or searching in different webs to find the perfect activity
  for our children. Therefore, this website was created to offer
  convenient filters and categories to swiftly discover the ideal
  activities.
</p>
<p>
  We aspire to inspire people with kids to find their next experience in
  Hamburg
</p>
<p>Have Fun!</p> */
}
