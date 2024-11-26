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
    <div className="relative flex justify-center rounded-md h-full min-w-[180px] gap-2">
      {children && (
        <div className="absolute top-1 left-0 text-white z-[100] w-full">
          {children}
        </div>
      )}

      <ImgPriorityCard
        size={size}
        id={id}
        title={title}
        image={image ? image[0] : ""}
        description={getPlainText(text)}
      ></ImgPriorityCard>
    </div>
  );
}
