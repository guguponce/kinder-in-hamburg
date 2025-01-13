"use client";
import Button from "@app/components/@Buttons/Button";
import TextPriorityCard from "@app/components/@Cards/TextPriorityCard";
import BoyGirlIcon from "@app/components/@Icons/@Events/BoyGirlIcon";
import KarussellBigIcon from "@app/components/@Icons/@Events/KarusselBigIcon";
import WeihnachtsmannIcon from "@app/components/@Icons/@Events/WeihnachtsmannIcon";
import ScrollableContainer from "@app/components/ScrollableContainer";
import { parseDescriptionWithTags } from "@app/utils/functions";
import { iBezirk, iFlohmarkt } from "@app/utils/types";
import React, { useMemo, useState } from "react";

interface AttraktionenProps {
  attraktionen: {
    karussell: iFlohmarkt[];
    kinderprogramm: iFlohmarkt[];
    weihnachtsmann: iFlohmarkt[];
  };
  children?: React.ReactNode;
}

type AttraktionenType = keyof AttraktionenProps["attraktionen"];
export default function Attraktionen({ attraktionen }: AttraktionenProps) {
  const [selectedAttraktion, setSelectedAttraktion] =
    useState<AttraktionenType>("karussell");
  const [selectedBezirk, setSelectedBezirk] = useState<iBezirk | null>(null);
  const attTypes = Object.keys(attraktionen) as AttraktionenType[];
  const bezirke = useMemo(
    () =>
      Array.from(
        new Set(attraktionen[selectedAttraktion].map(({ bezirk }) => bezirk))
      ).sort((a, b) => {
        if (a === "Umland Hamburg") return 1;
        if (b === "Umland Hamburg") return -1;
        return a.localeCompare(b);
      }),
    [selectedAttraktion, attraktionen]
  );
  const displayList = useMemo(
    () =>
      !selectedBezirk
        ? attraktionen[selectedAttraktion]
        : attraktionen[selectedAttraktion].filter(
            ({ bezirk }) => bezirk === selectedBezirk
          ),
    [selectedAttraktion, selectedBezirk, attraktionen]
  );
  return (
    <section className="w-full max-w-full rounded-lg bg-gradient-to-br from-[#7896a550] to-[#7896a525] p-2 shadow-xl text-hh-800 md:max-w-[800px]">
      <h2 className="text-2xl font-bold ml-2">Weihnachtsmärkte mit</h2>
      <div className="flex items-center gap-2 ml-2 max-w-full">
        {attTypes.map((attType) => (
          <Button
            key={attType}
            onClick={() => setSelectedAttraktion(attType)}
            fontWeight="semibold"
            variant="hh-dark"
            size="small"
            fontSize="xs"
            className={`px-2 py-1 rounded-lg text-sm ${attType !== "weihnachtsmann" && "capitalize"} flex gap-2 items-center min-w-fit ${selectedAttraktion === attType ? "outline-2 outline-hh-900 outline-offset-1" : "opacity-25"} shadow-sm`}
          >
            {attType === "karussell" && (
              <KarussellBigIcon
                color={selectedAttraktion === attType ? "#fefefe" : "#fefefe"}
              />
            )}
            {attType === "kinderprogramm" && <BoyGirlIcon color="#fefefe" />}
            {attType === "weihnachtsmann" && (
              <WeihnachtsmannIcon
                color={selectedAttraktion === attType ? "#fefefe" : "#fefefe"}
              />
            )}
            <span
              className={`sm:block ${selectedAttraktion === attType ? "block" : "hidden"}`}
            >
              {attType === "weihnachtsmann" ? "Weihnachtsmann" : attType}
            </span>
          </Button>
        ))}
      </div>
      <ScrollableContainer>
        {displayList.map(
          ({ id, image, title, date, optionalComment, bezirk, stadtteil }) => (
            <React.Fragment key={id}>
              <TextPriorityCard
                id={id}
                aspectRatio={2 / 3}
                bezirk={bezirk}
                stadtteil={stadtteil}
                date={date}
                link={"/events/" + id}
                title={title}
                description={parseDescriptionWithTags(optionalComment)}
                size="small"
                image={image || "/assets/icons/weihnachtsmarkt.svg"}
                cardContainerClassname="max-w-[150px]"
                imgClassname={image ? "object-cover" : "object-contain p-2"}
              />
            </React.Fragment>
          )
        )}
      </ScrollableContainer>
      {!!bezirke.length && (
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-2 mt-2 max-w-full">
          {bezirke.map((bezirk) => (
            <Button
              key={bezirk}
              onClick={() =>
                setSelectedBezirk((prev) => (prev === bezirk ? null : bezirk))
              }
              fontWeight="semibold"
              variant="hh-dark"
              size="small"
              fontSize="xs"
              className={`px-2 py-1 rounded-lg capitalize min-w-fit ${selectedBezirk === bezirk ? "outline-2 outline-hh-900 outline-offset-1" : !!selectedBezirk && "opacity-25"} shadow-sm`}
            >
              {bezirk}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}
