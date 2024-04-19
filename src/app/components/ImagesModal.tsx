"use client";
import React, { useMemo, useRef } from "react";

export default function ImagesModal({
  images,
  firstImage,
  title,
  handleCloseModal,
}: {
  title: string;
  images: string[];
  firstImage: string;
  handleCloseModal: () => void;
}) {
  const imageList = useRef([
    ...images.slice(images.indexOf(firstImage)),
    ...images.slice(0, images.indexOf(firstImage)),
  ]);
  const [currentImage, setCurrentImage] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imageList.current.length);
  };
  const handlePrevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + imageList.current.length) % imageList.current.length
    );
  };

  return (
    <div
      className="w-screen -translate-x-1/2 left-1/2 mx-auto h-[100dvh] z-[500] fixed top-0 flex justify-center items-center bg-black bg-opacity-25 backdrop-blur-sm"
      ref={containerRef}
      // onClick={handleCloseModal}
    >
      <button
        onClick={handleCloseModal}
        className="rounded-full hover:bg-white hover:text-hh-800 flex justify-center items-center -translate-x-1/2 right-0 top-4 text-white border-2 border-white font-semibold hover:font-bold p-2 absolute"
      >
        Close
      </button>
      <div
        className="relative w-full h-[calc(100%-150px)]  aspect-square flex justify-around gap-2 items-center bg-hh-300 bg-opacity-25 px-4"
        ref={modalRef}
      >
        <button
          onClick={handlePrevImage}
          className="h-10 w-10 rounded-lg bg-hh-800 text-white text-3xl font-bold backdrop-opacity-20"
        >
          {"<"}
        </button>
        <img
          src={imageList.current[currentImage]}
          alt={title}
          className=" w-auto h-auto max-h-full"
        />
        <button
          onClick={handleNextImage}
          className="h-10 w-10 rounded-lg bg-hh-800 text-white text-3xl font-bold backdrop-opacity-20"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
