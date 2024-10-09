import {
  getApprovedPostWithCat,
  getSuggestedPostWithCat,
} from "@app/api/dbActions";
import RandomRecommendation from "@app/components/@Cards/RandomRecommendation";
import DynamicCategoryMap from "@app/components/@Map/DynamicCategoryMap";
import PointsGallery from "@app/components/@PostForm/PointsGallery";
import FilterablePostList from "@app/components/FilterablePostList";
import AdminRoute from "@app/providers/AdminRoute";
import { categoryNames, relatedCategories } from "@app/utils/constants";
import { parseParams, sortPostsByDate } from "@app/utils/functions";
import { categoryName } from "@app/utils/types";
import NotFound from "@app/components/@NotFound/NotFound";
import React from "react";

export default async function CategoriesPage({
  params: { category: cat },
}: {
  params: { category: string };
}) {
  const category = parseParams(cat) as categoryName;
  if (!categoryNames.includes(category)) return <NotFound type="categories" />;
  //----------------------------------------------------------
  const categoryPosts = await getSuggestedPostWithCat(category);
  console;
  if (!categoryPosts) return <NotFound type="categories" />;
  const highlightedWithImages = categoryPosts.filter(
    (post) => post.image && post.pinnedPost
  );
  const randomCategory =
    relatedCategories[category][
      Math.floor(Math.random() * relatedCategories[category].length)
    ];
  const randomCategoryPosts = categoryPosts
    .filter((post) => post.categories.includes(randomCategory))
    .sort(() => 0.5 - Math.random());
  //-------------------------------
  //----------------------------

  return (
    <AdminRoute>
      <main className="w-full max-w-[1200px] flex flex-col items-center gap-4 ">
        <h1 className="text-4xl text-white font-bold">{category}</h1>
        <section
          id="category-hero"
          className="flex flex-wrap gap-4 justify-center w-full h-full"
        >
          {!!highlightedWithImages.length && (
            <section className="w-full max-w-[600px] aspect-[1.5]">
              <PointsGallery
                horizontal={true}
                posts={
                  highlightedWithImages.slice(0, 3) ||
                  sortPostsByDate(categoryPosts).slice(0, 3)
                }
              >
                <h2 className=" text-lg md:text-2xl font-semibold text-hh-50 bg-hh-900 bg-opacity-50 rounded p-1 w-fit">
                  {!!highlightedWithImages.length ? "#highlights" : "#Latest"}
                </h2>
              </PointsGallery>
            </section>
          )}
          <section className="h-full rounded-md flex flex-row flex-wrap justify-center gap-2">
            <RandomRecommendation
              shuffle
              size="medium"
              posts={[...categoryPosts].sort(() => 0.5 - Math.random())}
            />
          </section>
          <FilterablePostList postsList={categoryPosts}>
            <h1 className="font-bold min-w-fit text-center   text-3xl ">
              All {category} Posts
            </h1>
          </FilterablePostList>
        </section>
        {/* {category === "Badeplatz" && ( */}
        <DynamicCategoryMap catPosts={categoryPosts} category={category} />
        {/* )} */}
      </main>
    </AdminRoute>
  );
}
