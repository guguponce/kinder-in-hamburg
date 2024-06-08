"use client";
import SpielgeraeteIcon from "@app/components/@Icons/@Spielplatz/SpielgeraeteIcon";
import React, { useLayoutEffect, useState } from "react";

export default function Spielgeraete({
  spielgeraete,
}: {
  spielgeraete: string[];
}) {
  const [open, setOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [spielgeraeteHeight, setSpielgeraeteHeight] = useState<number>(88);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const spielgeraeteRef = React.useRef<HTMLDivElement>(null);
  const handleOpen = () => {
    setOpen(true);
    setShowButton(false);
  };
  useLayoutEffect(() => {
    if (containerRef.current) {
      // Check if the content height exceeds the initial height
      const containerHeight = containerRef.current.scrollHeight;
      const initialHeight = 128;
      if (containerHeight > initialHeight) {
        setShowButton(true);
      }
    }
  }, [spielgeraete]);
  useLayoutEffect(() => {
    if (spielgeraeteRef.current) {
      setSpielgeraeteHeight(spielgeraeteRef.current.scrollHeight);
    }
  }, [spielgeraete]);

  return (
    <section
      id="spielplatz-spielgeraete-box"
      className={`${
        open ? "h-fit" : spielgeraeteHeight < 112 ? "h-fit" : "h-32"
      } max-h-fit relative mb-4 lg:mb-0 rounded-md p-2 bg-hh-200 bg-opacity-25 lg:max-w-full overflow-hidden`}
      ref={containerRef}
    >
      <div
        className="flex flex-wrap gap-2 justify-evenly lg:justify-end"
        ref={spielgeraeteRef}
      >
        {spielgeraete.map((spielgeraet) => (
          <div
            key={spielgeraet}
            className="bg-hh-200 p-2 rounded-md capitalize flex-grow flex items-center gap-2 font-semibold text-hh-900 max-w-[260px] h-10"
          >
            <div className="iconContainer h-full aspect-square">
              <SpielgeraeteIcon
                logo={spielgeraet}
                color="#33404D"
                size="1.5rem"
              />
            </div>
            {spielgeraet}
          </div>
        ))}
      </div>
      <button
        onClick={handleOpen}
        className={`${
          showButton ? "flex" : "hidden"
        } absolute bottom-0 backdrop-blur-[1px] w-full h-12 from-hh-400 to-[#758CA370] bg-gradient-to-t items-center justify-center font-semibold text-hh-50 z-30 rounded`}
      >
        Alle Spielgeräte anzeigen
      </button>
    </section>
  );
}
