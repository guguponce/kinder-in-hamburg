import ScrollableCardList from "@app/components/@Cards/ScrollableCardList";
import { iPost } from "@app/utils/types";
import React from "react";
import WasserSectionTemplate from "./WasserSectionTemplate";

export default function Badeseen({ badeseen }: { badeseen: iPost[] }) {
  return (
    <WasserSectionTemplate
      title="Badeseen"
      text="Sie sind natürliche oder künstliche Seen, die zum Schwimmen genutzt
        werden. Die Ausstattung variiert von einfachen, naturbelassenen Ufern
        bis hin zu Bereichen mit Rettungsschwimmern, Toiletten und Imbissen. Die
        Wasserqualität ist unbehandelt und wird während der Badesaison
        regelmäßig überprüft."
    >
      <div className="w-fit max-w-full">
        <ScrollableCardList cardType="image" size="medium" posts={badeseen} />
      </div>
    </WasserSectionTemplate>
  );
}
