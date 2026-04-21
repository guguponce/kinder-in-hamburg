import React from "react";
import PaperPlane from "./@Icons/PaperPlane";

export default function NoEventsBanner({
  type = "flohmaerkte",
}: {
  type?: "flohmaerkte" | "events";
}) {
  return (
    <div className="max-w-full flex flex-col items-center">
      <h2 className="text-xl sm:text-2xl font-semibold text-white text-center p-1 lg:p-2">
        Keine {type === "flohmaerkte" ? "Flohmärkte" : "Veranstaltungen"}{" "}
        gefunden
      </h2>
      <p className="text-hh-100">
        Wenn ihr einen veranstaltet oder kennt, schreibt uns gerne eine E-Mail.
      </p>
      <a
        href="mailto:admin@kinder-in-hamburg.de"
        className="flex items-center gap-2 self-center p-4 bg-hh-800 text-hh-100 font-semibold rounded-lg mt-4 w-max hover:bg-hh-700 transition-colors duration-300 ease-in-out mb-2"
      >
        <PaperPlane />
        admin@kinder-in-hamburg.de
      </a>
    </div>
  );
}
