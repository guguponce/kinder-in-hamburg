import React from "react";
import DeleteSVG from "@app/assets/svg/DeleteSVG";
import Button from "@app/components/@Buttons/Button";
import { deleteSupabaseFiles } from "@app/api/spActions";

export default function DeleteSupabaseImageButton({
  bucket,
  imageName,
  setImagesArray,
  imageIndex,
}: {
  bucket: string;
  imageName: string;
  imageIndex: number;
  setImagesArray?: React.Dispatch<
    React.SetStateAction<
      Array<{
        url: string;
        fileName: string;
      }>
    >
  >;
}) {
  return (
    <Button
      variant="negative"
      size="small"
      onClick={async (e) => {
        e.preventDefault();
        try {
          await deleteSupabaseFiles(bucket, [imageName]);
          if (setImagesArray) {
            setImagesArray((prev) =>
              prev.filter((prevImage, i) => {
                return !(
                  i === imageIndex &&
                  prevImage.fileName === imageName.split("/").pop()
                );
              })
            );
          }
        } catch (err) {
          console.error(err);
        }
      }}
    >
      <DeleteSVG />
    </Button>
  );
}
