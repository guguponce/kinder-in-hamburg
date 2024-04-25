import { getThisWeekFlohmaerkte } from "@app/api/dbActions";
import React from "react";
import ScrollableContainer from "../ScrollableContainer";
import FlohmarktPoster from "../@PostForm/FlohmarktPoster";

export default async function ThisWeekFlohmaerkte() {
  const thisWeek = await getThisWeekFlohmaerkte();
  if (!thisWeek || !thisWeek.length) return <></>;
  const sortedFlohmaerkte = thisWeek.sort((a, b) => a.date - b.date);
  return (
    <section className="nextWeekendFlohmarkt bg-hh-100 bg-opacity-10 p-2 w-full flex justify-center gap-2 items-center">
      <ScrollableContainer>
        {sortedFlohmaerkte.map(({ title, image, date, id, bezirk }) => (
          <React.Fragment key={id}>
            <article className="w-full sm:w-1/2 min-w-[180px] max-w-[200px] min-h-[270px] h-auto bg-hh-200 rounded ">
              <FlohmarktPoster
                id={id}
                title={title}
                image={image}
                date={date}
                bezirk={bezirk}
              />
            </article>{" "}
          </React.Fragment>
        ))}
      </ScrollableContainer>
    </section>
  );
}
