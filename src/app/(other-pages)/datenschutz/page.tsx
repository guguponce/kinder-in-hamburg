import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <main className="rounded-lg p-4 w-full max-w-[800px] bg-hh-200 text-hh-900 flex flex-col gap-2">
      <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
      <div className="rounded p-2 bg-hh-100 bg-opacity-75">
        <h2 className="text-xl font-semibold p-1">
          1. Datenschutz auf einen Blick
        </h2>

        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h3 className="text-lg font-semibold p-1">1.1 Allgemeine Hinweise</h3>
          <p className="px-2">
            Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
            Nachfolgend informieren wir Sie über die Verarbeitung Ihrer
            personenbezogenen Daten beim Besuch unserer Website.
          </p>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h3 className="text-lg font-semibold p-1">
            1.2 Datenerfassung auf unserer Website
          </h3>
          <div className="rounded p-2 bg-hh-100 bg-opacity-75">
            <h4 className="fonsemi">
              Wer ist verantwortlich für die Datenerfassung auf dieser Website?
            </h4>
            <p className="px-2">
              Die Datenverarbeitung auf dieser Website erfolgt durch den
              Websitebetreiber. Kontaktinformationen finden Sie im Impressum
              dieser Website.
            </p>

            <h4 className="fonsemi">Wie erfassen wir Ihre Daten?</h4>
            <p className="px-2">
              Ihre Daten werden zum einen durch Ihre Angaben an uns erhoben. Zum
              anderen werden technische Daten automatisch beim Besuch der
              Website durch unsere IT-Systeme erfasst.
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
              Sie haben das Recht, Auskunft über Ihre gespeicherten
              personenbezogenen Daten zu erhalten, diese zu berichtigen, zu
              löschen oder die Verarbeitung einzuschränken. Für weitere
              Informationen dazu und bei Fragen zum Datenschutz wenden Sie sich
              bitte an die im Impressum angegebene Kontaktadresse.
            </p>
          </div>
        </div>
        <div className="rounded p-2 bg-hh-100 bg-opacity-75">
          <h3 className="text-lg font-semibold p-1">
            1.3 Analyse-Tools und Tools von Drittanbietern
          </h3>
          <div
            id="vercel-container"
            className="rounded p-2 bg-hh-100 bg-opacity-75"
          >
            <h4 className="text-lg font-semibold p-1">Vercel Web Analytics</h4>
            <div className="rounded p-2 bg-hh-100 bg-opacity-75">
              <p className="px-2">
                Wir verwenden Vercel Web Analytics, um Einblicke in die Nutzung
                unserer Website zu erhalten. Vercel Web Analytics arbeitet in
                Übereinstimmung mit führenden Datenschutzstandards und erfasst
                keine personenbezogenen Daten (PII) und verwendet keine Cookies
                von Drittanbietern zu Tracking-Zwecken.
              </p>
              <h5 className="text-base font-semibold p-1">Datensammlung</h5>
              <p className="px-2">
                Vercel Web Analytics erfasst anonyme, aggregierte Datenpunkte,
                einschließlich:
              </p>
              <ul className="ml-8">
                <li className="list-disc">Ereigniszeitstempel</li>
                <li className="list-disc">URL</li>
                <li className="list-disc">Dynamischer Pfad</li>
                <li className="list-disc">Referrer</li>
                <li className="list-disc">Abgefilterte Abfrageparameter</li>
                <li className="list-disc">Geolokation</li>
                <li className="list-disc">Gerätebetriebssystem & Version</li>
                <li className="list-disc">Browser & Version</li>
                <li className="list-disc">Gerätetyp</li>
                <li className="list-disc">Web Analytics Skriptversion</li>
              </ul>
              <h5 className="text-base font-semibold p-1">
                Besucheridentifizierung und Datenspeicherung
              </h5>
              <p className="px-2">
                Besuchersitzungen werden durch einen Hash generiert aus dem
                eingehenden Request identifiziert, und Sitzungsdaten werden
                automatisch nach 24 Stunden verworfen. Es werden keine
                personenbezogenen Daten gespeichert oder an Vercel-Server
                übertragen.
              </p>
              <h5 className="text-base font-semibold p-1">Konformität</h5>
              <p className="px-2">
                Unsere Verwendung von Vercel Web Analytics entspricht relevanten
                Datenschutzbestimmungen, wie z. B. der DSGVO. Wir legen Wert auf
                den Schutz der Privatsphäre und Transparenz bei der
                Datensammlung.
              </p>
              <h5 className="text-base font-semibold p-1">Anpassung</h5>
              <p className="px-2">
                Um die Benutzerprivatsphäre weiter zu gewährleisten, haben wir
                Vercel Web Analytics so konfiguriert, dass sensible oder
                personenbezogene Daten aus Datenpunkten ausgeschlossen sind.
                Dazu gehört die Schwärzung von URLs und Abfrageparametern, die
                identifizierbare Daten enthalten.
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
            id="vercel-container"
            className="rounded p-2 bg-hh-100 bg-opacity-75"
          >
            <h4 className="text-lg font-semibold p-1"> Simple Analytics</h4>
            <div className="rounded p-2 bg-hh-100 bg-opacity-75">
              <p className="px-2">
                Wir verwenden Simple Analytics, um Einblicke in die Nutzung
                unserer Website zu erhalten. Simple Analytics legt großen Wert
                auf Datenschutz und erfasst keine personenbezogenen Daten (PII)
                und verwendet keine Cookies von Drittanbietern zu
                Tracking-Zwecken.
              </p>
              <h5 className="text-base font-semibold p-1">Datensammlung</h5>
              <p className="px-2">
                Simple Analytics erfasst anonyme, aggregierte Datenpunkte,
                einschließlich:
              </p>
              <ul className="ml-8">
                <li className="list-disc">Ereigniszeitstempel</li>
                <li className="list-disc">URL</li>
                <li className="list-disc">Referrer</li>
                <li className="list-disc">Geolokation (auf Stadtebene)</li>
                <li className="list-disc">
                  Gerätetyp (z. B. Mobilgerät oder Desktop)
                </li>
                <li className="list-disc">Browser & Version</li>
                <li className="list-disc">Betriebssystem</li>
                <li className="list-disc">Spracheinstellungen</li>
              </ul>
              <h5 className="text-base font-semibold p-1">
                Besucheridentifizierung und Datenspeicherung
              </h5>
              <p className="px-2">
                Im Gegensatz zu traditionellen Analysewerkzeugen verwendet
                Simple Analytics keine personenbezogenen Daten, keine
                eindeutigen Tracking-IDs oder Cookies. Anstatt Sitzungen
                nachzuverfolgen, werden aggregierte Daten gesammelt, ohne den
                Benutzer als individuelle Person zu identifizieren. Simple
                Analytics speichert nur anonyme, nicht rückverfolgbare Daten.
              </p>
              <h5 className="text-base font-semibold p-1">Konformität</h5>
              <p className="px-2">
                Unsere Verwendung von Simple Analytics entspricht relevanten
                Datenschutzbestimmungen, wie z. B. der DSGVO und der
                ePrivacy-Verordnung. Es werden keine personenbezogenen Daten
                gesammelt, und die Privatsphäre unserer Nutzer wird
                vollumfänglich geschützt.
              </p>
              <h5 className="text-base font-semibold p-1">Anpassung</h5>
              <p className="px-2">
                Simple Analytics ist so konfiguriert, dass keine
                identifizierbaren Daten gesammelt oder verfolgt werden. Es gibt
                keine Schwärzung von URLs, da keine personenbezogenen
                Informationen erfasst werden.
              </p>
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
      </div>
      <div className="rounded p-2 bg-hh-100 bg-opacity-75">
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
            <ul className="ml-8">
              <li className="list-disc">supabase-auth.callback-url</li>
              <li className="list-disc">supabase-auth.csrf-token</li>
              <li className="list-disc">supabase-auth.session-token</li>
              <li className="list-disc">sb-auth-token.0</li>
              <li className="list-disc">sb-auth-token.1</li>
            </ul>
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
            <ul className="ml-8">
              <li className="list-disc">Browsertyp und Browserversion</li>
              <li className="list-disc">verwendetes Betriebssystem</li>
              <li className="list-disc">Referrer URL</li>
              <li className="list-disc">Hostname des zugreifenden Rechners</li>
              <li className="list-disc">Uhrzeit der Serveranfrage</li>
              <li className="list-disc">IP-Adresse</li>
            </ul>

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
      </div>
    </main>
  );
}
