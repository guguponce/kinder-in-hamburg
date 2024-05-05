import React from "react";

function PaperPlane() {
  return (
    <svg
      fill="#fefefe"
      width="1rem"
      height="1rem"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_iconCarrier">
        <path d="M0 14.016l9.216 6.912 18.784-16.928-14.592 20.064 10.592 7.936 8-32zM8 32l6.016-4-6.016-4v8z"></path>{" "}
      </g>
    </svg>
  );
}
export default function ContactPage() {
  return (
    <main className="rounded-lg p-4 w-full max-w-[600px] bg-hh-100 text-hh-900 bg-opacity-90 flex flex-col gap-2">
      <h1 className="text-3xl font-bold">Kontakt</h1>
      <p className="text-xl font-semibold">Habt ihr Fragen oder Vorschläge?</p>
      <p>
        Wir freuen uns über Anregungen für neue Beiträge oder kommende
        Flohmärkte.
      </p>
      <p className="text-hh-900">
        <span className="text-negative-900">
          Wir arbeiten gerade an einem Formular für Vorschläge auf der Website.
        </span>{" "}
        Bis dahin könnt ihr uns gerne eine{" "}
        <a href="mailto:admin@kinder-in-hamburg.de" className="font-semibold">
          E-Mail
        </a>{" "}
        schicken.
      </p>
      <a
        href="mailto:admin@kinder-in-hamburg.de"
        className="flex items-center gap-2 self-center p-4 bg-hh-800 text-hh-100 font-semibold rounded-lg mt-4 w-max hover:bg-hh-700 transition-colors duration-300 ease-in-out"
      >
        <PaperPlane />
        admin@kinder-in-hamburg.de
      </a>
    </main>
  );
}

// <h1 className="text-3xl font-bold">Contact</h1>
// <p className="text-xl font-semibold">
//   Do you have any questions or suggestions?
// </p>
// <p>
//   We would love to get suggestions of places for new posts or of upcoming
//   flea markets.
// </p>
// <p className="text-hh-900">
//   <span className="text-negative-900">
//     We are currently developing a suggestions form for the website.
//   </span>{" "}
//   In the meantime, please{" "}
//   <span className="font-semibold">send us an email.</span>
// </p>
