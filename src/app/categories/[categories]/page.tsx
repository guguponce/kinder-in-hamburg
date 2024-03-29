import { getPostWithCategory } from "@app/api/dbActions";
import { parsePost } from "@app/utils/functions";
import CardsDisplay from "@app/components/CardsDisplay";
import React from "react";

export default async function CurrentCategoryPage({
  params,
}: {
  params: { categories: string };
}) {
  const { categories } = params;

  const categoryPosts = await getPostWithCategory(categories);
  if (!categoryPosts) return <div>Category not found</div>;
  const parsedPosts = categoryPosts.map((post) => parsePost(post));
  return (
    <main>
      <CardsDisplay id={"category"} cardPosts={parsedPosts} />
    </main>
  );
}
