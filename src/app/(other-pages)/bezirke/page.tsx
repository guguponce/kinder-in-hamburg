import { bezirke } from "@app/utils/constants";
import React from "react";
import BezirkCards from "./BezirkCards";
import { getHamburgsWeather } from "@app/api/weatherAPI";

export default function BezirkePage() {
  return (
    <>
      <h1 className="font-bold text-xl">Bezirke</h1>
      <h2 className="font-bold text-hh-700 text-base">
        Where do you want to go?
      </h2>
      <section className="flex flex-wrap rounded shadow-sm gap-2 my-2">
        {bezirke.map((bezirk) => (
          <React.Fragment key={bezirk}>
            <BezirkCards bezirk={bezirk} />
          </React.Fragment>
        ))}
      </section>
    </>
  );
}
