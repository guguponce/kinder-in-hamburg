import { iSpielplatz } from "@app/utils/types";
import React from "react";
import ShuffleGallery from "@components/@Cards/ShuffleGallery";
import WasserSectionTemplate from "./WasserSectionTemplate";

export default function Planschbecken({
  planschbecken,
}: {
  planschbecken: iSpielplatz[];
}) {
  return (
    <WasserSectionTemplate
      title="Planschbecken"
      text="Diese flachen Becken sind speziell für Kinder zum Spielen und Abkühlen angelegt. Sie sind oft mit Wasserpumpen oder anderen kleinen Wasserspielen ausgestattet. Meist müssen sie am Ende des Tages geleert und bei schönem Wetter wieder befüllt werden. Und viele von ihnen werden nicht von der Bezirksamt verwaltet, sondern von privaten Trägern/Initiativen, die für den Betrieb und den Wasserwechsel verantwortlich sind."
    >
      {" "}
      <div className="flex justify-center items-center mt-auto w-full py-2">
        <div className="self-center w-full max-w-[300px] aspect-[6/7]  bg-hh-900 bg-opacity-10 rounded">
          <ShuffleGallery list={planschbecken} shuffle={true} />
        </div>
      </div>
    </WasserSectionTemplate>
  );
}
