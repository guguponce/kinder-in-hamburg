import ScrollableCardList from "@app/components/@Cards/ScrollableCardList";
import { iPost } from "@app/utils/types";
import { removeCopyrightLine } from "@app/utils/functions";
import React from "react";
import WasserSectionTemplate from "./WasserSectionTemplate";

export default function Freibaeder({ freibaeder }: { freibaeder: iPost[] }) {
  const withoutCopyright = freibaeder.map((post) => {
    post.text[0][1] = removeCopyrightLine(post.text[0][1]);
    return post;
  });
  return (
    <WasserSectionTemplate
      title="Freibäder"
      text="Sie sind angelegte, meist von Kommunen oder privaten Betreibern betriebene Schwimmbäder im Freien. Diese Anlagen umfassen oft mehrere Becken, wie Schwimm-, Tauch- und Kinderbecken, und bieten zusätzliche Einrichtungen wie Wasserrutschen, Umkleidekabinen und Imbisse. Die Wasserqualität wird regelmäßig durch chemische Behandlung, beispielsweise mit Chlor, gewährleistet."
    >
      <div className="w-fit max-w-full">
        <ScrollableCardList
          cardType="text-priority"
          size="small"
          posts={withoutCopyright}
        />
      </div>
    </WasserSectionTemplate>
  );
}
