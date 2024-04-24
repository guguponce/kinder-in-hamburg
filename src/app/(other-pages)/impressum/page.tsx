import Link from "next/link";
import React from "react";
export default function Impressum() {
  return (
    <main className="rounded-lg p-4 w-full max-w-[800px] bg-hh-100 text-hh-900 bg-opacity-90 flex flex-col gap-2">
      <h1 className="text-3xl font-bold">Impressum</h1>
      <div className="rounded p-2">
        <h2 className="text-xl font-semibold p-1">Angaben gemäß § 5 TMG:</h2>
        <div className="px-2">
          <p>Kinder in Hamburg</p>
          <p className="mt-1">Addresse:</p>
          <p>Eimsbütteler Chaussee</p>
          <p>20259, Hamburg</p>
          <a
            href="mailto:kinder.in.hamburg.hh@gmail.com"
            className="mt-1 text-hh-800"
          >
            kinder.in.hamburg.hh@gmail.com
          </a>
        </div>
      </div>
      <div className="rounded p-2">
        <h2 className="text-xl font-semibold p-1">Vertreten durch:</h2>
        <p className="px-2">Augusto Ponce</p>
      </div>
      <div className="rounded p-2">
        <h2 className="text-xl font-semibold p-1">Kontakt:</h2>
        <a
          href="mailto:kinder.in.hamburg.hh@gmail.com"
          className="mt-1 px-2 text-hh-800"
        >
          kinder.in.hamburg.hh@gmail.com
        </a>
      </div>
      <div className="rounded p-2">
        <h3 className="text-lg font-semibold p-1">
          Haftungsausschluss (Disclaimer):
        </h3>
        <div className="rounded p-2">
          <h3 className="text-lg font-semibold p-1">Haftung für Inhalte</h3>
          <p className="px-2">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung
            oder Sperrung der Nutzung von Informationen nach den allgemeinen
            Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist
            jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
            Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>
        </div>
        <div className="rounded p-2">
          <h3 className="text-lg font-semibold p-1">Haftung für Links</h3>
          <p className="px-2">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich. Die verlinkten Seiten wurden zum
            Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
            erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten
            Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung
            nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
            derartige Links umgehend entfernen.
          </p>
        </div>
        <div className="rounded p-2">
          <h3 className="text-lg font-semibold p-1">Urheberrecht</h3>
          <p className="px-2">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            Downloads und Kopien dieser Seite sind nur für den privaten, nicht
            kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser
            Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte
            Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
            gekennzeichnet. Sollten Sie trotzdem auf eine
            Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
            entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
            werden wir derartige Inhalte umgehend entfernen.
          </p>
        </div>
        <div className="rounded p-2">
          <h3 className="text-lg font-semibold p-1">Datenschutzerklärung</h3>
          <p className="px-2">
            Sie können unsere{" "}
            <Link
              href={"/datenschutz"}
              className="text-hh-700 active:text-hh-600 underline underline-offset-4 font-semibold"
            >
              Datenschutzerklärung
            </Link>{" "}
            lesen.
          </p>
        </div>
      </div>{" "}
    </main>
  );
}
