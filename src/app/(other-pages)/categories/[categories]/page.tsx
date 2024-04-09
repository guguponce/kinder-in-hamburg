import { getSuggestionsWithCat } from "@app/api/dbActions";
import {
  getDescription,
  getPlainText,
  parseParams,
  parsePost,
} from "@app/utils/functions";
import CardsDisplay from "@app/components/@Cards/CardsDisplay";
import React from "react";
import Card from "@app/components/@Cards/Card";
import { categoryNames } from "@app/utils/constants";

export default async function CurrentCategoryPage({
  params,
}: {
  params: { categories: string };
}) {
  const { categories } = params;
  const category = parseParams(categories);
  if (categoryNames.every((c) => c.toLowerCase() != category.toLowerCase()))
    return <>{category} is not one of out Categories</>;
  const categoryPosts = await getSuggestionsWithCat(category);
  return (
    <main className="w-full  max-w-[1000px] p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold">{category.toUpperCase()}</h1>
      <section className="w-fit flex justify-center md:justify-around flex-wrap p-2 gap-4">
        {!categoryPosts.length ? (
          <div>No posts found for {category}</div>
        ) : (
          categoryPosts.map(({ id, title, text, image }) => (
            <React.Fragment key={id}>
              <Card
                size="small"
                id={id}
                title={title}
                image={
                  image
                    ? image[0]
                    : `https://dummyimage.com/200x100/47596b/fff.jpg&text=${title}`
                }
                description={getPlainText(text)}
              />
            </React.Fragment>
          ))
        )}
      </section>
      {/* <CardsDisplay id={"category"} cardPosts={categoryPosts} /> */}
    </main>
  );
}
