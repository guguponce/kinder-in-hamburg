"use client";
import React, { useEffect, useMemo, useState } from "react";
import "firebase/storage";
import DownloadImageButton from "./DownloadImageButton";
import DeleteImageButton from "./DeleteImageButton";
import UploadImagePreview from "./UploadImagePreview";
import { type FullMetadata } from "firebase/storage";
import { getImagesURLs, uploadPostImage } from "@app/api/storageActions";
import { convertAllFilesToWebp } from "@app/utils/functions";
import LoadingIcon from "../@Icons/LoadingIcon";
import DeleteSupabaseImageButton from "@app/(spielplatz)/DeleteSupabaseImage";
import { imageDataURLSetter } from "@app/utils/types";

interface ImageUploaderUIProps {
  type?: "post" | "event" | "spielplatz" | "flohmarkt";
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleUpload: () => Promise<void>;
  uploadStatus:
    | "uploading"
    | "converting"
    | "await"
    | "success"
    | "error"
    | "paused";
  imageFiles: File[];
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setLocalImageUrl: React.Dispatch<React.SetStateAction<string[]>>;
  previousImagesURLS: Array<{
    url: string;
    fileName: string;
    metadata?: FullMetadata;
  }>;
  imagesURLS: Array<{ url: string; fileName: string; metadata?: FullMetadata }>;
  localImageUrl: string[];
  id: number;
  setImagesURLS?: imageDataURLSetter;
  setPreviousImagesURLS: imageDataURLSetter;
  maxMBText: string;
  maxMB: number;
}

export const ImageUploaderUI = ({
  type = "post",
  id,
  maxMBText,
  setPreviousImagesURLS,
  uploadStatus,
  imageFiles,
  setImageFiles,
  setLocalImageUrl,
  fileInputRef,
  handleImageChange,
  handleUpload,
  localImageUrl,
  previousImagesURLS,
  imagesURLS,
  setImagesURLS,
  maxMB,
}: ImageUploaderUIProps) => {
  const filesSize = useMemo(
    () => imageFiles.reduce((acc, { size }) => acc + size, 0),
    [imageFiles]
  );

  const statusDisplay = {
    text: {
      converting: "Converting images",
      uploading: "Uploading images",
      await: "Pending to upload",
      success: "Images uploaded",
      error: "Error uploading images",
      paused: "Upload paused",
    },
    color: {
      converting: "text-sun-500",
      uploading: "text-sun-200",
      await: "text-sun-300",
      success: "text-positive-300",
      error: "text-negative-500",
      paused: "text-negative-500",
    },
  } as const;

  return (
    <div
      id="images-upload-container"
      className="bg-hh-800 p-4 text-gray-900 max-w-[800px] mx-auto text-sm w-full"
    >
      <h2 className="text-xl font-bold text-white underline">
        Images<span className="ml-2 text-negative-200 no-underline">*</span>
        <span className="text-sm text-negative-200 no-underline">
          {maxMBText}
        </span>
      </h2>

      <label
        htmlFor="images"
        className="mt-4 text-sm leading-7 text-gray-100 flex gap-2 flex-wrap items-stretch"
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          name="images"
          onChange={handleImageChange}
          className="flex max-w-[300px] flex-wrap rounded  border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
        />
        {uploadStatus !== "await" && (
          <div className="font-bold flex items-center justify-center text-yellow-500">
            {statusDisplay.text[uploadStatus]}
          </div>
        )}
      </label>

      {(!!imageFiles.length ||
        !!previousImagesURLS.length ||
        !!imagesURLS.length) && (
        <div className="my-4 flex flex-col items-center gap-2 text-white">
          {!!imageFiles.length && (
            <>
              <div className="flex gap-4">
                <button
                  className="rounded bg-positive-600 px-4 py-2 font-bold text-white hover:bg-positive-800"
                  disabled={
                    !imageFiles.length ||
                    (uploadStatus !== "await" && uploadStatus !== "success")
                  }
                  onClick={() => handleUpload()}
                >
                  Upload Images
                </button>
                <button
                  className="flex h-10 w-fit items-center justify-center rounded bg-negative-500 px-2 py-2 font-bold text-white hover:bg-negative-700 "
                  onClick={() => {
                    setImageFiles([]);
                    setLocalImageUrl([]);
                    fileInputRef.current!.value = "";
                  }}
                >
                  Cancel
                </button>
              </div>
              <div className="rounded border-4 border-[hsl(0,0%,100%,0.6)] bg-black bg-opacity-20 p-4 text-white flex flex-col items-center w-full">
                <div id="images-status" className="flex justify-between w-full">
                  <h3 className="font-semibold italic mb-2">
                    All files sizes:{" "}
                    <span
                      className={
                        filesSize > maxMB * 1000000 ? "text-negative-200" : ""
                      }
                    >
                      {(filesSize / 1000000).toFixed(2)} / {maxMB} mb
                    </span>
                  </h3>
                  <div className="font-semibold flex gap-1">
                    Status:{" "}
                    <span className={statusDisplay.color[uploadStatus]}>
                      {statusDisplay.text[uploadStatus]}
                    </span>
                  </div>
                </div>
                <ol className="list-decimal flex flex-wrap gap-x-2 gap-y-4 items-stretch justify-center">
                  {imageFiles.map((image, i) => (
                    <li
                      className="flex flex-col items-center gap-1 w-full"
                      key={image.name + image.size + i}
                    >
                      <img
                        src={localImageUrl[i]}
                        alt={image.name}
                        className="flex-grow w-full max-w-[400px] max-h-[75vh] object-contain"
                      />
                      <div className="flex gap-4 flex-col items-center">
                        <p className="mt-auto font-semibold">
                          {image.name.length > 20
                            ? image.name.slice(0, 8) +
                              "..." +
                              image.name.slice(-10)
                            : image.name}{" "}
                          {image.size > 1000000
                            ? `(${(image.size / 1000000).toFixed(2)} mb)`
                            : `(${(image.size / 1000).toFixed(2)} kb)`}
                        </p>
                        {(type === "post" || type === "spielplatz") && (
                          <button
                            className="flex h-10 w-fit items-center justify-center rounded bg-negative-500 px-2 py-2 font-bold text-white hover:bg-negative-700 "
                            onClick={() => {
                              setImageFiles((prev) =>
                                prev.filter((_, index) => index !== i)
                              );
                              setLocalImageUrl((prev) =>
                                prev.filter((_, index) => index !== i)
                              );
                              fileInputRef.current!.value = "";
                            }}
                          >
                            Lösch Foto
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-4">
                <button
                  className="rounded bg-positive-600 px-4 py-2 font-bold text-white hover:bg-positive-800"
                  disabled={
                    !imageFiles.length ||
                    (uploadStatus !== "await" && uploadStatus !== "success")
                  }
                  onClick={() => handleUpload()}
                >
                  Upload Images
                </button>
                <button
                  className="flex h-10 w-fit items-center justify-center rounded bg-negative-500 px-2 py-2 font-bold text-white hover:bg-negative-700 "
                  onClick={() => {
                    setImageFiles([]);
                    setLocalImageUrl([]);
                    fileInputRef.current!.value = "";
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
          {(!!previousImagesURLS.length || !!imagesURLS.length) && (
            <div className="self-start">
              {!!previousImagesURLS.length && (
                <div
                  id="previous-images-container"
                  className="p-2 font-semibold"
                >
                  <h3 className="italic">List of previous images</h3>
                  <div className="flex flex-wrap items-stretch justify-stretch gap-4 py-4">
                    {previousImagesURLS.map((imageUrl, imageIndex) => (
                      <div
                        className={`
                         flex min-w-36 flex-col items-center  justify-between rounded border-2 border-green-900 p-2`}
                        key={imageUrl.url}
                      >
                        <UploadImagePreview
                          imageUrl={imageUrl.url}
                          imageFileName={imageUrl.fileName}
                        >
                          {type === "spielplatz" ? (
                            <DeleteSupabaseImageButton
                              imageIndex={imageIndex}
                              imageName={`${id}/${imageUrl.fileName}`}
                              setImagesArray={setPreviousImagesURLS}
                              bucket="spielplaetze"
                            />
                          ) : (
                            <DeleteImageButton
                              imageIndex={imageIndex}
                              imageName={imageUrl.fileName}
                              path={`${type === "post" ? "postsImages" : "flohmaerkteImages"}/${id}`}
                              setImagesArray={setPreviousImagesURLS}
                            />
                          )}
                          <DownloadImageButton
                            imageName={imageUrl.fileName}
                            imageUrl={imageUrl.url}
                          />
                        </UploadImagePreview>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!!imagesURLS.length && (
                <div id="recent-images-container" className="p-2 font-semibold">
                  <h3 className="italic">Recently uploaded images</h3>
                  <div className="flex-wrap flex items-stretch gap-4 py-4">
                    {imagesURLS.map((imageUrl, imageIndex) => (
                      <div
                        className={`flex w-36 flex-col items-center justify-between rounded  border-2 border-positive-400 p-2`}
                        key={imageUrl.url}
                      >
                        <UploadImagePreview
                          imageUrl={imageUrl.url}
                          imageFileName={imageUrl.fileName}
                        >
                          {type === "spielplatz" ? (
                            <DeleteSupabaseImageButton
                              imageIndex={imageIndex}
                              imageName={`${id}/${imageUrl.fileName}`}
                              setImagesArray={setImagesURLS}
                              bucket="spielplaetze"
                            />
                          ) : (
                            <DeleteImageButton
                              imageIndex={imageIndex}
                              imageName={imageUrl.fileName}
                              path={`postsImages/${id}`}
                              setImagesArray={
                                setImagesURLS || setPreviousImagesURLS
                              }
                            />
                          )}
                        </UploadImagePreview>
                      </div>
                    ))}

                    {uploadStatus === "uploading" && (
                      <div className="font-bold flex flex-col items-center self-stretch justify-center text-yellow-500">
                        <LoadingIcon color="#fefefe" size="3rem" />
                        Uploading images...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}{" "}
        </div>
      )}
    </div>
  );
};

export default ImageUploaderUI;
