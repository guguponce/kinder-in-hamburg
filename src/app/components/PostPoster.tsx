import React from "react";

export default function PostPoster({
  title,
  image,
  backupImg,
  bezirk,
  stadtteil,
  titleUnder = false,
}: {
  titleUnder?: boolean;
  backupImg?: string;
  title: string;
  bezirk?: string;
  stadtteil?: string;
  image?: string;
  spielgeraete?: string[];
}) {
  return (
    <div
      className={`w-full h-full flex ${
        titleUnder ? "flex-col-reverse" : "flex-col"
      }  items-center`}
    >
      <h3 className="font-bold text-xl text-hh-50 p-2 text-center rounded-sm bg-hh-900 bg-opacity-30 backdrop-blur-sm absolute z-10 flex flex-col">
        {title}
        {stadtteil && (
          <span className="block text-xs">
            ({stadtteil}, {bezirk})
          </span>
        )}
      </h3>
      <div className="w-full h-full flex items-center justify-center rounded overflow-hidden">
        {!!image && (
          <img
            loading="lazy"
            src={image}
            alt={title}
            className="object-cover w-full h-full rounded"
          />
        )}
      </div>
    </div>
  );
}
