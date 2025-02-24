import React from "react";
import DeleteSVG from "@app/assets/svg/DeleteSVG";
import { deleteImage } from "@app/api/storageActions";
import { imageDataURLSetter } from "@app/utils/types";
export default function DeleteImageButton({
  path,
  imageName,
  setImagesArray,
  imageIndex,
}: {
  path: string;
  imageName: string;
  imageIndex: number;
  setImagesArray?: imageDataURLSetter;
}) {
  return (
    <button
      className="flex h-10 w-10 mx-auto items-center justify-center rounded bg-negative-500 px-2 py-2 font-bold text-white hover:bg-negative-700 "
      onClick={async () => {
        deleteImage(path, imageName)
          .then(() => {
            if (setImagesArray) {
              setImagesArray((prev) =>
                prev.filter(
                  (prevImage, i) =>
                    !(i === imageIndex && prevImage.fileName === imageName)
                )
              );
            }
          })
          .catch((err) => console.error(err));
      }}
    >
      <DeleteSVG />
    </button>
  );
}
