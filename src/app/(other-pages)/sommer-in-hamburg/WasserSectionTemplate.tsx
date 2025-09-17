import React from "react";

export default function WasserSectionTemplate({
  children,
  title,
  text,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col p-2 sm:p-4 w-full h-full text-hh-700 bg-gradient-to-b from-hh-100 to-[#4b98be11] shadow-lg bg-opacity-75 rounded-lg">
      <h2 className="text-2xl font-bold text-hh-700 py-2">{title}</h2>
      <p className="italic text-xs max-w-[100ch]">{text}</p>
      {children}
    </section>
  );
}
