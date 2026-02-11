import React from "react";
import PaperPlane from "../@Icons/PaperPlane";

export default function NoFlohmarktBanner({
  weekday,
  isSunday,
}: {
  weekday: number;
  isSunday: boolean;
}) {
  return (
    <section
      id="current-week-section"
      className={`flex gap-4 w-full justify-center`}
    >
      <div className="max-w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-hh-800 text-center p-1 lg:p-2">
          {weekday !== 6 && !isSunday
            ? "Diese Woche finden keine Flohmärkte statt"
            : "Für den Rest der Woche finden keine Flohmärkte statt"}
        </h2>
        <p className="text-hh-800">
          Wenn ihr einen veranstaltet oder kennt, schreibt uns gerne eine
          E-Mail.
        </p>
        <a
          href="mailto:admin@kinder-in-hamburg.de"
          className="flex items-center gap-2 self-center p-4 bg-hh-800 text-hh-100 font-semibold rounded mt-4 w-max hover:bg-hh-700 transition-colors duration-300 ease-in-out"
        >
          <PaperPlane />
          admin@kinder-in-hamburg.de
        </a>
      </div>
    </section>
  );
}
