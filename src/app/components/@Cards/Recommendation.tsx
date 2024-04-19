import { iPost } from "@app/utils/types";
import React from "react";
import ImgPriorityCard from "./ImgPriorityCard";
import { getPlainText } from "@app/utils/functions";

export default function Recommendation({
  post,
  children,
  size = "small",
}: {
  size?: "small" | "medium" | "large";
  post: iPost;
  children?: React.ReactNode;
}) {
  const { id, title, text, image } = post;
  return (
    <div className="flex flex-col items-center rounded-md h-full gap-2">
      <div className="relative h-full flex justify-center">
        <div className="absolute top-1 left-0 text-white z-[100] w-full">
          {children}
        </div>

        <ImgPriorityCard
          size={size}
          id={id}
          title={title}
          image={image ? image[0] : ""}
          description={getPlainText(text)}
        ></ImgPriorityCard>
      </div>
    </div>
  );
}
