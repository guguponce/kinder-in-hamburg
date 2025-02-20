"use client";
import React, { useRef } from "react";
import GeneralContainer from "./GeneralContainer";
import { categoryName, iPost } from "@app/utils/types";
import Button from "./@Buttons/Button";
import ScrollableCardList from "./@Cards/ScrollableCardList";
import IndoorIcon from "./@Icons/@CategoryIcons/IndoorIcon";
import OutdoorIcon from "./@Icons/@CategoryIcons/OutdoorIcon";

export default function ToggleListView({
  postsList,
  firstDisplayCategory,
  classname,
}: {
  postsList: { [x: string]: iPost[] };
  firstDisplayCategory?: categoryName;
  classname?: string;
}) {
  const [selectedCategory, setSelectedCategory] = React.useState<categoryName>(
    firstDisplayCategory || "Indoor"
  );
  const { current: availableCategories } = useRef(Object.keys(postsList));
  return (
    <GeneralContainer type="section" classname={classname}>
      <aside className="self-start ml-2 flex justify-center items-center flex-wrap gap-4 md:py-2">
        {availableCategories.map((category) => (
          <React.Fragment key={category}>
            <Button
              onClick={() => setSelectedCategory(category as categoryName)}
              className={`${
                selectedCategory === category
                  ? "bg-hh-800 text-hh-50 hover:bg-hh-900 outline outline-2 outline-offset-2"
                  : "bg-hh-100 text-hh-800 hover:bg-hh-200"
              }  flex items-center gap-1`}
            >
              {category === "Indoor" ? (
                <IndoorIcon
                  color={selectedCategory === category ? "#e1e4e5" : "#33404d"}
                />
              ) : (
                category === "Outdoor" && (
                  <OutdoorIcon
                    color={
                      selectedCategory === category ? "#e1e4e5" : "#33404d"
                    }
                  />
                )
              )}
              <span className="block">{category}</span>
            </Button>
          </React.Fragment>
        ))}
      </aside>
      <ScrollableCardList
        cardType="text-priority"
        descriptions
        size="medium"
        posts={postsList[selectedCategory]}
      />
    </GeneralContainer>
  );
}
