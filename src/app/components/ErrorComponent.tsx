import AdminClientComponent from "@app/providers/AdminClientComponents";
import Link from "next/link";
import React from "react";

export default function ErrorComponent({
  error,
  reset,
}: {
  error: string;
  reset: () => void;
}) {
  return (
    <main className="p-8 flex flex-col gap-2 items-center bg-gradient-to-br  from-[#fef3f250] to-[#fefefe50] rounded border-2 border-negative-700">
      <h1 className="text-3xl font-semibold text-negative-800">
        Oops! Etwas ist schiefgelaufen 😕
      </h1>
      <AdminClientComponent>
        <p className="text-lg text-negative-900">
          {'"'}
          {error}
          {'"'}
        </p>
      </AdminClientComponent>
      <p className="text-base text-negative-950">
        Es sieht so aus, als wäre ein Fehler aufgetreten.
      </p>
      <p className="text-base text-negative-950">Das kannst du tun:</p>

      <div className="flex justify-center items-center gap-1">
        <button
          className="p-2 text-white bg-positive-700 rounded"
          onClick={() => reset()}
        >
          Seite neu laden
        </button>
        <Link href={"/"} className="p-2 text-white bg-negative-700 rounded">
          Zur Startseite gehen
        </Link>
      </div>
      <p className="text-base mt-4 mb-1 text-negative-950 max-w-[75%]">
        Falls der Fehler weiterhin besteht und du uns helfen möchtest, kannst du
        uns über das Problem informieren, damit wir es schnellstmöglich lösen:
      </p>
      <Link
        href="mailto:admin@kinder-in-hamburg.de"
        className="p-2 text-white bg-hh-700 rounded block"
      >
        Email senden
      </Link>
    </main>
  );
}
