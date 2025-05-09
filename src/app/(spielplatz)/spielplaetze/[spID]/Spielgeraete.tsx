"use client";
import SpielgeraeteIcon from "@components/@Icons/@Spielplatz/SpielgeraeteIcon";
import { spielgeraeteList } from "@app/utils/constants";
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
  const spielgeraeteOrder = spielgeraeteList.filter((spielgeraet) =>
    spielgeraete.includes(spielgeraet)
  );
  return (
    <section
      id="spielplatz-spielgeraete-box"
      className={`${
        open ? "h-fit" : spielgeraeteHeight < 112 ? "h-fit" : "h-32 lg:h-fit"
      } max-h-fit relative lg:mb-0 rounded-md p-2 bg-hh-500 outline-2 outline-hh-600 outline bg-opacity-25 lg:max-w-full overflow-hidden`}
      ref={containerRef}
    >
      <div
        className="flex flex-wrap gap-2 justify-center lg:justify-end"
        ref={spielgeraeteRef}
      >
        {spielgeraeteOrder.map((spielgeraet) => (
          <div
            key={spielgeraet}
            className={`spielgeraet bg-hh-50 bg-opacity-75 p-2 rounded-md capitalize flex items-center gap-2 font-semibold text-hh-900  h-10`}
          >
            <div className="iconContainer h-full aspect-square">
              <SpielgeraeteIcon
                logo={spielgeraet}
                color="#33404D"
                size="1.5rem"
              />
            </div>
            <div className="flex-grow flex justify-center items-center">
              {spielgeraet}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleOpen}
        className={`${
          showButton ? "flex lg:hidden" : "hidden"
        } absolute bottom-0 backdrop-blur-[1px] w-[calc(100%+8px)] -left-2 h-12 from-hh-400 to-[#758CA370] bg-gradient-to-t items-center justify-center font-semibold text-hh-50 z-30 rounded-[0_0_4px_4px]`}
      >
        Alle Spielgeräte anzeigen
      </button>
    </section>
  );
}
