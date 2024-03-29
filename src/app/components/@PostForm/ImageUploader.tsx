"use client";
import React, { useEffect, useMemo, useState } from "react";
import "firebase/storage";
import DownloadImageButton from "./DownloadImageButton";
import DeleteImageButton from "./DeleteImageButton";
import UploadImagePreview from "./UploadImagePreview";
import { type FullMetadata } from "firebase/storage";
import { getImagesURLs, uploadPostImage } from "@app/api/storageActions";
import { filterExtraImages } from "@app/utils/functions";

interface ImageUploaderProps {
  mainImage: string | undefined;
  setMainImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setImagesUrlsReady: React.Dispatch<
    React.SetStateAction<{
      ready: boolean;
      urls: string[];
    }>
  >;
  id: number;
  email: string;
}

export const ImageUploader = ({
  id,
  setImagesUrlsReady,
  setMainImage,
  mainImage,
  email,
}: ImageUploaderProps) => {
  const [previousImagesURLS, setPreviousImagesURLS] = useState<
    Array<{ url: string; fileName: string; metadata: FullMetadata }>
  >([]);
  const [imageFiles, setImageFiles] = useState<Array<File>>([]);
  const [imagesURLS, setImagesURLS] = useState<
    Array<{ url: string; fileName: string; metadata: FullMetadata }>
  >([]);
  const [uploadStatus, setUploadStatus] = useState<
    "await" | "uploading" | "success" | "error" | "paused"
  >("await");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    getImagesURLs(`postsImages/${id}`).then((urls) => {
      setPreviousImagesURLS(urls);
    });
  }, [id]);

  useEffect(() => {
    if (
      (imagesURLS.length || previousImagesURLS.length) &&
      !imageFiles.length
    ) {
      console.log("images changed");
      setImagesUrlsReady({
        ready: true,
        urls: [...imagesURLS, ...previousImagesURLS].map((url) => url.url),
      });
    } else {
      setImagesUrlsReady((prev) => ({ ...prev, ready: false }));
    }
  }, [imagesURLS, setImagesUrlsReady, imageFiles, previousImagesURLS]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImages = filterExtraImages(
      Array.from(e.target.files as FileList)
    );
    setImageFiles(selectedImages);
  };

  const handleUpload = async () => {
    console.log("first");
    Promise.all(
      imageFiles.map((image) => {
        uploadPostImage(
          email,
          id.toString(),
          image,
          setImagesURLS,
          setUploadStatus
        );
      })
    )
      .then(() => {
        setImageFiles([]);
        fileInputRef.current!.value = "";
      })
      .catch((error) => console.log("Error in HandleUpload", error));
  };
  const filesSize = useMemo(
    () => imageFiles.reduce((acc, { size }) => acc + size, 0),
    [imageFiles]
  );

  return (
    <div
      id="images-upload-container"
      className="bg-[hsl(31,33%,57%)] p-4 text-gray-900"
    >
      <h2 className="text-xl font-bold text-white underline">
        Images<span className="ml-2 text-red-600 no-underline">*</span>
        <span className="text-sm text-red-600 no-underline">
          (Max. size for all images together: 10mb)
        </span>
      </h2>
      <label htmlFor="images" className="text-sm leading-7 text-gray-100">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          name="images"
          onChange={handleImageChange}
          className="mt-4 flex max-w-[300px] flex-wrap rounded  border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[hsl(35,73%,57%)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
        />
      </label>
      {!!imageFiles.length && (
        <div className="my-4 rounded border-4 border-[hsl(0,0%,100%,0.6)] bg-black bg-opacity-20 p-4 text-white">
          <div className="flex justify-between">
            <h3 className="font-semibold italic">
              Selected Image Files{" "}
              <span className={filesSize > 10000000 ? "text-red-200" : ""}>
                (full size: {(filesSize / 1000000).toFixed(2)}
                mb)
              </span>
            </h3>
            (status: {uploadStatus === "await" ? "not uploaded" : uploadStatus})
          </div>
          <ol className="list-decimal">
            {imageFiles.map((image) => (
              <li className="ml-6" key={image.name}>
                {image.name} - ({`${(image.size / 1000000).toFixed(2)} mb`})
              </li>
            ))}
          </ol>
          <div className="my-4 flex gap-4">
            <button
              className="rounded bg-[hsl(31,33%,37%)] px-4 py-2 font-bold text-white hover:bg-yellow-700"
              disabled={
                !imageFiles.length ||
                (uploadStatus !== "await" && uploadStatus !== "success")
              }
              onClick={() => handleUpload()}
            >
              Upload Images
            </button>
            <button
              className="flex h-10 w-fit items-center justify-center rounded bg-red-500 px-2 py-2 font-bold text-white hover:bg-red-700 "
              onClick={() => {
                setImageFiles([]);
                fileInputRef.current!.value = "";
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {(!!previousImagesURLS.length ||
        !!imagesURLS.length ||
        uploadStatus === "uploading") && (
        <div className="my-4 min-h-[260px] rounded bg-[hsl(220,14%,96%)] bg-opacity-60 p-2">
          {!!previousImagesURLS.length && (
            <div id="previous-images-container" className="p-2 font-semibold">
              <h3 className="italic text-gray-900">List of previous images</h3>
              <div className="flex flex-wrap items-stretch justify-stretch gap-4 py-4">
                {previousImagesURLS.map((imageUrl, imageIndex) => (
                  <div
                    className={`${
                      mainImage === imageUrl.url
                        ? "outline-double outline-2 outline-offset-2 outline-[hsl(31,73%,37%)]"
                        : ""
                    } flex min-w-36 flex-col items-center  justify-between rounded bg-[hsla(31,73%,37%,0.6)] p-2`}
                    key={imageUrl.url}
                  >
                    <UploadImagePreview
                      imageUrl={imageUrl.url}
                      imageFileName={imageUrl.fileName}
                    >
                      <DeleteImageButton
                        imageIndex={imageIndex}
                        imageName={imageUrl.fileName}
                        path={`postsImages/${id}`}
                        setImagesArray={setPreviousImagesURLS}
                      />
                      <DownloadImageButton
                        imageName={imageUrl.fileName}
                        imageUrl={imageUrl.url}
                      />
                    </UploadImagePreview>
                    <button
                      onClick={() => {
                        setMainImage(imageUrl.url);
                      }}
                      className={`${
                        mainImage === imageUrl.url
                          ? "bg-[hsla(31,43%,27%,0.6)] text-white"
                          : "bg-[hsla(31,73%,87%,0.6)] text-gray-700"
                      } mt-2  flex w-28 flex-col items-center justify-center rounded p-2  text-sm hover:outline-[hsla(31,73%,87%,0.6)]`}
                    >
                      {mainImage === imageUrl.url
                        ? "Main image"
                        : "Set as main image"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!!imagesURLS.length && (
            <div id="recent-images-container" className="p-2 font-semibold">
              <h3 className="italic text-gray-900">Recently uploaded images</h3>
              <div className="wrap flex items-stretch justify-stretch gap-4 py-4">
                {imagesURLS.map((imageUrl, imageIndex) => (
                  <div
                    className={`${
                      mainImage === imageUrl.url
                        ? "outline-double outline-2 outline-offset-2 outline-[hsl(31,73%,37%)]"
                        : ""
                    } flex w-36 flex-col items-center justify-between rounded bg-[hsla(31,73%,37%,0.6)] p-2`}
                    key={imageUrl.url}
                  >
                    <UploadImagePreview
                      imageUrl={imageUrl.url}
                      imageFileName={imageUrl.fileName}
                    >
                      <DeleteImageButton
                        imageIndex={imageIndex}
                        imageName={imageUrl.fileName}
                        path={`postsImages/${id}`}
                        setImagesArray={setImagesURLS}
                      />
                    </UploadImagePreview>
                    <button
                      onClick={() => {
                        setMainImage(imageUrl.url);
                      }}
                      className={`${
                        mainImage === imageUrl.url
                          ? "bg-[hsla(31,43%,27%,0.6)] text-white"
                          : "bg-[hsla(31,73%,87%,0.6)] text-gray-700"
                      } mt-2  flex flex-col items-center justify-center rounded p-2  text-sm hover:outline-[hsla(31,73%,87%,0.6)]`}
                    >
                      {mainImage === imageUrl.url
                        ? "Main image"
                        : "Set as main image"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
