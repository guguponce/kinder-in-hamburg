import React from "react";
import DeleteSVG from "@app/assets/svg/DeleteSVG";
import { deleteImage } from "@app/api/storageActions-server";
import { imageDataURLSetter } from "@app/utils/types";
export default function DeleteImageButton({
  bucket,
  path,
  imageName,
  setImagesArray,
  imageIndex,
}: {
  bucket: string;
  path: string | number;
  imageName: string;
  imageIndex: number;
  setImagesArray?: imageDataURLSetter;
}) {
  return (
    <button
      className="flex h-10 w-10 mx-auto items-center justify-center rounded bg-negative-500 px-2 py-2 font-bold text-white hover:bg-negative-700 "
      onClick={async () => {
        try {
          await deleteImage(bucket, path, imageName);
          if (setImagesArray) {
            setImagesArray((prev) => {
              return prev.filter((prevImage, i) => {
                return !(i === imageIndex && prevImage.fileName === imageName);
              });
            });
          }
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }}
    >
      <DeleteSVG />
    </button>
  );
}
