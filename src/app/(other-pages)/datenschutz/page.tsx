import Link from "next/link";
import React from "react";

const List = ({ items }: { items: string[] }) => (
  <ul className="ml-8">
    <li className="list-disc">{items}</li>
  </ul>
);
export default function page() {
  return (
    <main className="rounded-lg p-4 w-full max-w-[800px] bg-hh-200 text-hh-900 flex flex-col gap-2">
      <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
      <div className="rounded p-2 bg-hh-100 bg-opacity-75">
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h3 className="text-lg font-semibold p-1">1 Allgemeine Hinweise</h3>
          <p className="px-2">
            Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
            Nachfolgend informieren wir Sie über die Verarbeitung Ihrer
            personenbezogenen Daten beim Besuch unserer Website.
          </p>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h3 className="text-lg font-semibold p-1">
            2 Datenerfassung auf unserer Website
          </h3>
          <div className="rounded p-2 bg-hh-100 bg-opacity-75">
            <h4 className="fonsemi">
              Wer ist verantwortlich für die Datenerfassung auf dieser Website?
            </h4>
            <p className="px-2">
              Die Datenverarbeitung auf dieser Website erfolgt durch den
              Websitebetreiber. Die Kontaktdaten finden Sie im Impressum.
            </p>

            <h4 className="fonsemi">Wie erfassen wir Ihre Daten?</h4>
            <p className="px-2">
              Ihre Daten werden einerseits dadurch erhoben, dass Sie uns diese
              mitteilen. Andere Daten werden automatisch beim Besuch der Website
              durch unsere IT-Systeme erfasst (technische Daten).
            </p>

            <h4 className="fonsemi">Wofür nutzen wir Ihre Daten?</h4>
            <p className="px-2">
              Ein Teil der Daten wird erhoben, um eine fehlerfreie
              Bereitstellung der Website zu gewährleisten. Andere Daten können
              zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>

            <h4 className="fonsemi">
              Welche Rechte haben Sie bezüglich Ihrer Daten?
            </h4>
            <p className="px-2">
              Sie haben jederzeit das Recht auf: - Auskunft über Ihre
              gespeicherten Daten - Berichtigung oder Löschung - Einschränkung
              der Verarbeitung Bei Fragen wenden Sie sich bitte an die im
              Impressum angegebene Kontaktadresse.
            </p>
          </div>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h3 className="text-lg font-semibold p-1">
            3 Analyse-Tools und Tools von Drittanbietern
          </h3>
          <div
            id="vercel-container"
            className="rounded p-2 bg-hh-100 bg-opacity-75"
          >
            <h4 className="text-lg font-semibold p-1">Vercel Web Analytics</h4>
            <div className="rounded p-2 bg-hh-100 bg-opacity-75">
              <p className="px-2">
                Wir nutzen Vercel Web Analytics, um die Nutzung unserer Website
                zu analysieren. Das Tool ist datenschutzfreundlich konfiguriert
                und verwendet keine Cookies für Tracking oder
                plattformübergreifende Nutzerverfolgung.
              </p>
              <p className="px-2">
                Es werden ausschließlich aggregierte Nutzungsdaten verarbeitet,
                z. B.:
              </p>
              <List
                items={[
                  "Seitenaufrufe",
                  "Referrer",
                  "Gerätetyp und Browserinformationen",
                  "allgemeine technische Informationen",
                ]}
              />
              <p className="px-2">
                Die Verarbeitung erfolgt auf Grundlage berechtigter Interessen
                zur Verbesserung unseres Angebots.
              </p>
              <p className="px-2">
                Für weitere Informationen zu Vercel Web Analytics und seinen
                Datenschutzfunktionen, lesen Sie bitte die{" "}
                <a
                  href="https://vercel.com/docs/analytics/privacy-policy"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="block underline underline-offset-4 text-hh-600 hover:text-hh-500"
                >
                  Datenschutzrichtlinie von Vercel
                </a>
              </p>
            </div>{" "}
          </div>{" "}
          <div
            id="simple-analytics-container"
            className="rounded p-2 bg-hh-100 bg-opacity-75"
          >
            <h4 className="text-lg font-semibold p-1"> Simple Analytics</h4>
            <div className="rounded p-2 bg-hh-100 bg-opacity-75">
              <p className="px-2">
                Wir nutzen zusätzlich Simple Analytics zur
                datenschutzfreundlichen Auswertung der Website-Nutzung. Simple
                Analytics verwendet keine Cookies und keine persönlichen
                Identifikatoren. Es werden ausschließlich aggregierte, nicht
                rückverfolgbare Daten verarbeitet, z. B.:
              </p>
              <List
                items={[
                  "Seitenaufrufe",
                  "Referrer",
                  "Gerätetyp",
                  "Browserinformationen",
                ]}
              />

              <p className="px-2">
                Für weitere Informationen zu Simple Analytics und ihren
                Datenschutzfunktionen lesen Sie bitte die Datenschutzrichtlinie
                von Simple Analytics.
                <a
                  href="https://dashboard.simpleanalytics.com/privacy-policy"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="block underline underline-offset-4 text-hh-600 hover:text-hh-500"
                >
                  Datenschutzrichtlinie von Simple Analytics
                </a>
              </p>
            </div>{" "}
          </div>{" "}
        </div>
        <div
          id="cloudflare-container"
          className="rounded p-2 bg-hh-100 bg-opacity-75"
        >
          <h4 className="text-lg font-semibold p-1">Cloudfare</h4>
          <div className="rounded p-2 bg-hh-100 bg-opacity-75">
            <p className="px-2">
              Wir nutzen Cloudflare als Content Delivery Network (CDN) und
              DNS-Anbieter. Dabei können technische Daten wie IP-Adressen und
              Anfrageinformationen verarbeitet werden, um Sicherheit, Stabilität
              und Performance der Website zu gewährleisten.
            </p>
          </div>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h3 className="text-lg font-semibold p-1">4 Funktionales Cookie</h3>
          <div className="rounded p-2 bg-hh-100 bg-opacity-75">
            <p className="px-2">
              Wir verwenden ein einzelnes funktionales Cookie („kih“).{" "}
            </p>
            <p className="px-2">Dieses Cookie:</p>
            <List
              items={[
                "speichert eine lokale Nutzereinstellung (z. B. ob bestimmte Komponenten angezeigt werden sollen)",
                "hat eine Lebensdauer von 7 Tagen",
                "dient ausschließlich der Funktionalität der Website",
                "verfolgt keine Nutzer über Websites hinweg",
              ]}
            />
          </div>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h3 className="text-lg font-semibold p-1">5 Rechtsgrundlage</h3>
          <div className="rounded p-2 bg-hh-100 bg-opacity-75">
            <p className="px-2">
              Die Verarbeitung erfolgt auf Grundlage unseres berechtigten
              Interesses an:
            </p>
            <p className="px-2">Dieses Cookie:</p>
            <List
              items={[
                "der technischen Bereitstellung der Website",
                "der Verbesserung unseres Angebots",
              ]}
            />
          </div>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h3 className="text-lg font-semibold p-1">
            6 Datenübermittlung an Dritte
          </h3>
          <div className="rounded p-2 bg-hh-100 bg-opacity-75">
            <p className="px-2">
              Wir geben keine personenbezogenen Daten zu Werbezwecken weiter.
              Technische Daten können jedoch an folgende Dienstleister
              übermittelt werden:
            </p>
            <List
              items={[
                "Vercel (Hosting und Analytics)",
                "Supabase (Datenbank und Speicher)",
                "Cloudflare (CDN und DNS)",
              ]}
            />
          </div>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h3 className="text-lg font-semibold p-1">7 Speicherdauer</h3>
          <div className="rounded p-2 bg-hh-100 bg-opacity-75">
            <p className="px-2">
              Personenbezogene Daten werden nur so lange gespeichert, wie es für
              den jeweiligen Zweck erforderlich ist.
            </p>
          </div>
        </div>

        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h3 className="text-lg font-semibold p-1">8 Kontakt</h3>
          <div className="rounded p-2 bg-hh-100 bg-opacity-75">
            <p className="px-2">
              Bei Fragen zum Datenschutz kontaktieren Sie uns bitte über die im
              Impressum angegebene E-Mail-Adresse.
            </p>
          </div>
        </div>
      </div>

      {/* <div className="rounded p-2 bg-hh-100 bg-opacity-75">
        <h2 className="text-xl font-semibold p-1">
          2. Allgemeine Hinweise und Pflichtinformationen
        </h2>

        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">Datenschutz</h4>
          <p className="px-2">
            Wir behandeln Ihre personenbezogenen Daten vertraulich und
            entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser
            Datenschutzerklärung.
          </p>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">Verantwortliche Stelle</h4>
          <div className="px-2">
            <p>Augusto Ponce</p>
            <p>Eimsbütteler Chaussee</p>
            <p>20259, Hamburg</p>
            <a
              href="mailto:admin@kinder-in-hamburg.de"
              className="mt-1 text-hh-800 underline underline-offset-4"
            >
              admin@kinder-in-hamburg.de
            </a>
          </div>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">
            Widerruf Ihrer Einwilligung zur Datenverarbeitung
          </h4>
          <p className="px-2">
            Sie können eine bereits erteilte Einwilligung zur Datenverarbeitung
            jederzeit widerrufen. Eine formlose Mitteilung per E-Mail an uns
            genügt. Die Rechtmäßigkeit der bis zum Widerruf erfolgten
            Datenverarbeitung bleibt vom Widerruf unberührt.
          </p>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">
            Beschwerderecht bei der zuständigen Aufsichtsbehörde
          </h4>
          <p className="px-2">
            Im Falle datenschutzrechtlicher Verstöße steht Ihnen ein
            Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Zuständige
            Aufsichtsbehörde ist [Name und Anschrift der Aufsichtsbehörde].
          </p>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">
            Recht auf Datenübertragbarkeit
          </h4>
          <p className="px-2">
            Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung
            oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich
            oder an einen Dritten in einem gängigen, maschinenlesbaren Format
            aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten
            an einen anderen Verantwortlichen verlangen, erfolgt dies nur,
            soweit es technisch machbar ist.
          </p>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">
            SSL- bzw. TLS-Verschlüsselung
          </h4>
          <p className="px-2">
            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
            Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen
            oder Anfragen, eine SSL-bzw. TLS-Verschlüsselung. Eine
            verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile
            des Browsers von {'"'}http://{'"'} auf {'"'}https://{'"'} wechselt
            und an dem Schloss-Symbol in Ihrer Browserzeile.
          </p>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">
            Auskunft, Sperrung, Löschung
          </h4>
          <p className="px-2">
            Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen
            jederzeit das Recht auf unentgeltliche Auskunft über Ihre
            gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger
            und den Zweck der Datenverarbeitung und ggf. ein Recht auf
            Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu
            weiteren Fragen zum Thema personenbezogene Daten können Sie sich
            jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
          </p>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">
            Widerspruch gegen Werbe-Mails
          </h4>
          <p className="px-2">
            Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten
            Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter
            Werbung und Informationsmaterialien wird hiermit widersprochen. Die
            Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte
            im Falle der unverlangten Zusendung von Werbeinformationen, etwa
            durch Spam-E-Mails, vor.
          </p>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">Externe Links</h4>
          <p className="px-2">
            Wir verwenden auf unserer Website Links, die zu anderen Websites
            führen (externe Links), diese sind besonders gekennzeichnet. Deren
            Inhalte befinden sich nicht auf unserem Server. Die externen Inhalte
            dieser Links wurden beim Setzen der Links geprüft. Es kann jedoch
            nicht ausgeschlossen werden, dass die Inhalte von den jeweiligen
            Anbietern nachträglich verändert wurden. Sollten Sie bemerken, dass
            die Inhalte der externen Anbieter gegen geltendes Recht verstoßen,
            teilen Sie uns dies bitte mit. Diese Datenschutzerklärung gilt nur
            für Inhalte auf unserer Website.
          </p>
        </div>
      </div>
      <div className="rounded p-2 bg-hh-100 bg-opacity-75">
        <h2 className="text-xl font-semibold p-1">
          3. Datenerfassung auf unserer Website
        </h2>

        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">Cookies</h4>
          <div className="rounded p-2 flex flex-col gap-1">
            <p>
              UnsereUnsere Website verwendet Cookies von Supabase, einem Dienst,
              der für die Authentifizierung auf unserer Website verantwortlich
              ist. Diese Cookies sind für die korrekte Funktionsweise der
              Authentifizierung erforderlich und enthalten keine persönlich
              identifizierbaren Informationen. Die verwendeten Cookies sind:
              Diese Cookies werden verwendet, um den Anmeldeprozess zu verwalten
              und sicherzustellen, dass Benutzer angemeldet bleiben, während sie
              die Website nutzen. Sie werden automatisch beim Besuch der Website
              gesetzt und bleiben für eine begrenzte Zeit gültig, um die Sitzung
              des Benutzers aufrechtzuerhalten.
            </p>
            <List items={[
              "supabase-auth.callback-url",
              "supabase-auth.csrf-token",
              "supabase-auth.session-token",
              "sb-auth-token.0",
              "sb-auth-token.1",
            ]} />
            <p>
              Diese Cookies werden verwendet, um den Anmeldeprozess zu verwalten
              und sicherzustellen, dass Benutzer angemeldet bleiben, während sie
              die Website nutzen. Sie werden automatisch beim Besuch der Website
              gesetzt und bleiben für eine begrenzte Zeit gültig, um die Sitzung
              des Benutzers aufrechtzuerhalten.
            </p>
            <p>
              Zusätzlich verwenden wir einen benutzerdefinierten Cookie namens
              &quot;kih&quot;, der den Wert &quot;1&quot; hat und nach 7 Tagen
              abläuft. Dieser Cookie ermöglicht es der Website, zu prüfen, ob
              ein Benutzer die Website bereits besucht hat. Wenn der Browser
              diesen Cookie nicht hat, zählt Vercel Analytics den Benutzer als
              neuen Besucher. Ist der Cookie vorhanden, wird der Benutzer nicht
              als neuer Besucher gezählt. Die Verwendung dieses Cookies erfolgt
              auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO, da der
              Websitebetreiber ein berechtigtes Interesse an der Optimierung der
              Besucherzählung hat.
            </p>
            <p>
              Unser Analysetools, Simple Analytics und Vercel Analytics, legen
              großen Wert auf den Schutz der Privatsphäre der Nutzer. Simple
              Analytics erfasst keine persönlichen Informationen und verwendet
              keine Cookies zu Tracking-Zwecken. Vercel Analytics hingegen
              analysiert das Nutzungsverhalten auf unserer Website, um die
              Leistung zu optimieren, ohne dabei persönliche Daten zu erfassen.
              Weitere Informationen finden Sie in den jeweiligen Abschnitten:
            </p>{" "}
            <a href="#vercel-container" className="text-hh-600">
              Erfahren Sie mehr über Simple Analytics.{" "}
            </a>
            <a href="#vercel-container" className="text-hh-600">
              Erfahren Sie mehr über Vercel Analytics
            </a>
          </div>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">Server-Log-Dateien</h4>
          <div className="rounded p-2 flex flex-col gap-1">
            <p>
              Der Provider der Seiten erhebt und speichert automatisch
              Informationen in so genannten Server-Log-Dateien, die Ihr Browser
              automatisch an uns übermittelt. Dies sind:
            </p>
            <List items={[
              "Browsertyp und Browserversion",
              "verwendetes Betriebssystem",
              "Referrer URL",
              "Hostname des zugreifenden Rechners",
              "Uhrzeit der Serveranfrage",
              "IP-Adresse",
            ]} />

            <p>
              Eine Zusammenführung dieser Daten mit anderen Datenquellen wird
              nicht vorgenommen.
            </p>
          </div>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h4 className="text-lg font-semibold p-1">Kontaktformular</h4>
          <p className="px-2">
            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden
            Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort
            angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den
            Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir
            nicht ohne Ihre Einwilligung weiter.
          </p>
        </div>
      </div> */}
    </main>
  );
}
