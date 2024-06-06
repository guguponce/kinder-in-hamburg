"use client";
import React, { useCallback } from "react";
import ScrollableContainer from "./ScrollableContainer";
import ImagesModal from "./ImagesModal";

export default function ImagesModalButton({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [currentImage, setCurrentImage] = React.useState<string>(images[0]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <>
      {isOpen && (
        <div className="relative flex justify-center">
          <ImagesModal
            firstImage={currentImage}
            handleCloseModal={handleCloseModal}
            images={images}
            title={title}
          />
        </div>
      )}

      <ScrollableContainer>
        {images.map((img, i) => (
          <div
            role="button"
            onClick={() => {
              setCurrentImage(img);
              setIsOpen(true);
            }}
            key={img + i}
            className="min-w-[200px] max-w-[300px] h-auto max-h-[400px]"
          >
            <img
              loading="lazy"
              key={"img" + i}
              src={img}
              alt={title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
      </ScrollableContainer>
    </>
  );
}
