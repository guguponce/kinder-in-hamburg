"use client";
import React, { useEffect, useRef } from "react";
import PostLogo from "./@Icons/@PostLogo/PostLogo";

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
  useEffect(() => {
    function handleKeyboardKeys(e: KeyboardEvent) {
      e.stopPropagation();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "Escape") handleCloseModal();
    }
    document.addEventListener("keydown", handleKeyboardKeys);
    return () => document.removeEventListener("keydown", handleKeyboardKeys);
  });

  return (
    <div
      tabIndex={0}
      className="w-screen -translate-x-1/2 left-1/2 mx-auto h-[100dvh] z-[500] fixed top-0 flex justify-center items-center bg-black bg-opacity-25 backdrop-blur-sm"
      ref={containerRef}
      // onClick={handleCloseModal}
    >
      <button
        onClick={handleCloseModal}
        className="h-10 w-10 text-3xl rounded-full hover:bg-white hover:text-hh-800 flex justify-center items-center -translate-x-1/2 right-0 top-4 text-white border-2 border-white font-semibold hover:font-bold p-1 absolute transition-all"
      >
        <span className="mb-[1px]">×</span>
      </button>
      <div
        className="relative w-full max-w-[1000px] h-[calc(100%-150px)]  aspect-square flex justify-around gap-2 items-center bg-hh-300 bg-opacity-25 px-4 lg:py-4"
        ref={modalRef}
      >
        <button
          onClick={handlePrevImage}
          className={`${
            images.length > 1 ? "flex" : "hidden"
          }  min-h-10 min-w-fit absolute top-1/2 sm:relative z-20 sm:top-auto left-6  sm:left-0 aspect-square rounded-lg bg-hh-800 text-white text-3xl font-bold bg-opacity-50 hover:bg-opacity-80 -rotate-90 justify-center items-center`}
        >
          <PostLogo logo="triangle" color="#fefefe" size="1.5rem" />
        </button>
        <div className="flex-grow h-full max-w-[800px] flex items-center justify-center">
          <img
            loading="lazy"
            src={imageList.current[currentImage]}
            alt={title}
            className=" w-auto h-auto max-h-full"
          />
        </div>
        <button
          onClick={handleNextImage}
          className={`${
            images.length > 1 ? "flex" : "hidden"
          } min-h-10 min-w-fit absolute top-1/2 sm:relative z-20 sm:top-auto right-6  sm:right-0 aspect-square rounded-lg bg-hh-800 text-white text-3xl font-bold bg-opacity-50 hover:bg-opacity-80 rotate-90 justify-center items-center`}
        >
          <PostLogo logo="triangle" color="#fefefe" size="1.5rem" />
        </button>
      </div>
    </div>
  );
}
