import React from "react";

export default function UploadImagePreview({
  imageUrl,
  imageFileName,
  children,
}: {
  imageUrl: string;
  imageFileName: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <img
        src={imageUrl}
        className="m-0 block h-28 w-24 object-contain"
        alt={imageFileName}
      />
      <div className="m-0 flex h-12 w-24 flex-row items-center justify-between">
        {children}
      </div>
    </>
  );
}
