import { getPostsWithCat } from "@app/api/dbActions";
import PointsGallery from "@components/@PostForm/PointsGallery";
import AdminRoute from "@app/providers/AdminRoute";
import {
  categoryNames,
  pluralCategoryEmpfehlungen,
  relatedCategories,
} from "@app/utils/constants";
import { parseParams, sortPostsByDate } from "@app/utils/functions";
import { categoryName } from "@app/utils/types";
import NotFound from "@components/@NotFound/NotFound";
import React from "react";
import ShuffleGallery from "@components/@Cards/ShuffleGallery";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = parseParams(params.category) as categoryName;
  const categoryDisplayName = categoryNames.includes(category)
    ? category
    : "Kategorie";
  const title = `${categoryDisplayName} - Posts`;
  const description = `Hier findet ihr Orte für Kinder, Jugendliche oder die ganze Familie aus der Kategorie "${categoryDisplayName}" in Hamburg zusammengestellt.`;
  const keywords = [
    categoryDisplayName.toLowerCase(),
    `hamburg ${categoryDisplayName.toLowerCase()}`,
    "kinder in hamburg",
    "familie",
    "posts hamburg",
    "posts kinder",
    "posts familie",
    "post hamburg",
    "post kinder",
    "post familie",
    "playground hamburg",
    "playgrounds hamburg",
  ];
  const imageUrl =
    (process.env.BASE_URL || "https://www.kinder-in-hamburg.de/") +
    "opengraph-image.png";
  const pageUrl = `https://www.kinder-in-hamburg.de/categories/${category}`;

  return {
    title,
    icons: "/favicon.ico",
    description,
    keywords,
    openGraph: {
      type: "website",
      url: pageUrl,
      title,
      description,
      images: imageUrl,
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      title,
      description,
      images: imageUrl,
      site: pageUrl,
      card: "summary_large_image",
    },
  };
}
const cachedCategoryPosts = unstable_cache(
  getPostsWithCat,
  ["allSuggestedPosts"],
  {
    revalidate: 60 * 5, //7 5 min
    tags: ["posts"],
  }
);

const DynamicURLFilteredList = dynamic(
  () => import("@components/Filters/URLFilteredList"),
  { ssr: false }
);

export default async function CategoriesPage({
  params: { category: cat },
}: {
  params: { category: string };
}) {
  const category = parseParams(cat) as categoryName;
  if (!categoryNames.includes(category)) return <NotFound type="categories" />;
  //----------------------------------------------------------
  const categoryPosts = await cachedCategoryPosts(
    [category],
    false,
    "kih-suggestions"
  );
  if (!categoryPosts) return <NotFound type="categories" />;
  const highlightedWithImages = categoryPosts.filter(
    ({ image, pinnedPost }) => !!image?.length && pinnedPost
  );
  const randomCategory =
    relatedCategories[category][
      Math.floor(Math.random() * relatedCategories[category].length)
    ];
  const randomCategoryPosts = categoryPosts
    .filter((post) => post.categories.includes(randomCategory))
    .sort(() => 0.5 - Math.random());
  //-------------------------------
  const randomlySorted = [...categoryPosts].sort(() => 0.5 - Math.random());
  //----------------------------
  return (
    <AdminRoute>
      <main className="w-full max-w-[1200px] flex flex-col items-center gap-4 px-1 sm:px-2">
        <h1 className="text-4xl text-white font-bold">
          {pluralCategoryEmpfehlungen[category]}
        </h1>
        <section
          id="category-hero"
          className="flex flex-wrap gap-4 justify-center w-full h-full"
        >
          {!!highlightedWithImages.length && (
            <section className="w-full max-w-[600px] aspect-[1.5] backdrop-brightness-95  rounded-lg">
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
          <section className="w-64 max-w-full shadow-lg rounded relative overflow-hidden text-hh-50 italic">
            <ShuffleGallery
              list={randomlySorted}
              postPoster={false}
              shuffle
              size="large"
              shuffleContainerClassName="shadow-none"
            />
          </section>
          <DynamicURLFilteredList postsList={categoryPosts} />
        </section>
      </main>
    </AdminRoute>
  );
}
