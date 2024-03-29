import React from "react";
// import { deleteImage } from "../../utils/firebase";
import { type FullMetadata } from "firebase/storage";
import DeleteSVG from "@app/assets/svg/DeleteSVG";
import { deleteImage } from "@app/api/storageActions";
export default function DeleteImageButton({
  path,
  imageName,
  setImagesArray,
  imageIndex,
}: {
  path: string;
  imageName: string;
  imageIndex: number;
  setImagesArray?: React.Dispatch<
    React.SetStateAction<
      Array<{ url: string; fileName: string; metadata: FullMetadata }>
    >
  >;
}) {
  return (
    <button
      className="flex h-10 w-10 items-center justify-center rounded bg-red-500 px-2 py-2 font-bold text-white hover:bg-red-700 "
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
          .catch((err) => console.log(err));
      }}
    >
      <DeleteSVG />
    </button>
  );
}
