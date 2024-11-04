"use client";
import React, { useEffect, useMemo, useState } from "react";
import "firebase/storage";
import { type FullMetadata } from "firebase/storage";
import { filterExtraImages, sleep } from "@app/utils/functions";
import { iSessionUser } from "@app/utils/types";
import {
  // getSupabaseImagesFromFolder,
  handleUploadToSupabaseStorage,
} from "@app/api/storageActions";
import {
  getAllImagesURLFromSupabseFolder,
  listFilesInFolder,
} from "@app/api/spActions";
import UploadImagePreview from "@app/components/@PostForm/UploadImagePreview";
import DeleteImageButton from "./DeleteSupabaseImage";
import DownloadImageButton from "@app/components/@PostForm/DownloadImageButton";

interface ImageUploaderProps {
  setImagesUrlsReady: React.Dispatch<
    React.SetStateAction<{
      ready: boolean;
      urls: string[];
    }>
  >;
  id: number;
  user: iSessionUser;
}

export const SpielplatzImageUploader = ({
  id,
  setImagesUrlsReady,
  user,
}: ImageUploaderProps) => {
  const [previousImage, setPreviousImage] = useState<
    Array<{ url: string; fileName: string }>
  >([]);
  const [imageFiles, setImageFiles] = useState<Array<File>>([]);
  const [imagesURL, setImagesURL] = useState<
    Array<{ url: string; fileName: string }>
  >([]);
  const [uploadStatus, setUploadStatus] = useState<
    "await" | "uploading" | "success" | "error" | "paused"
  >("await");
  const [error, setError] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllImagesURLFromSupabseFolder("spielplaetze", id.toString()).then(
      (data) => {
        setPreviousImage(data);
      }
    );
  }, [id]);

  useEffect(() => {
    if (!imageFiles.length) {
      setImagesUrlsReady({
        ready: true,
        urls: [...imagesURL, ...previousImage].map((url) => url.url),
      });
    } else {
      setImagesUrlsReady((prev) => ({ ...prev, ready: false }));
    }
  }, [imagesURL, setImagesUrlsReady, imageFiles, previousImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedImages = filterExtraImages(
      Array.from(e.target.files as FileList)
    );
    setImageFiles(selectedImages);
  };

  const handleUpload = async () => {
    if (!imageFiles.length) return;
    setUploadStatus("uploading");
    try {
      const urls = (
        await Promise.all(
          imageFiles.map((image) =>
            handleUploadToSupabaseStorage(id.toString(), "spielplaetze", image)
          )
        )
      )
        .filter((url) => !!url.data)
        .map(
          ({ data }) =>
            data as {
              url: string;
              fileName: string;
            }
        );
      setImageFiles([]);
      fileInputRef.current!.value = "";
      setImagesURL((prev) => [...prev, ...urls]);
      setUploadStatus("success");
    } catch (e) {
      setUploadStatus("error");
    }
  };

  const filesSize = imageFiles.reduce((acc, { size }) => acc + size, 0);
  return (
    <div
      id="images-upload-container"
      className="bg-hh-800 p-4 text-gray-900 max-w-[800px] mx-auto text-sm"
    >
      <h2 className="text-xl font-bold text-white underline">
        Images<span className="ml-2 text-negative-200 no-underline">*</span>
        <span className="text-sm text-negative-200 no-underline">
          (Max. size all together: 5mb)
        </span>
      </h2>

      <label htmlFor="images" className="text-sm leading-7 text-gray-100">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          name="images"
          multiple
          onChange={handleImageChange}
          className="mt-4 flex max-w-[300px] flex-wrap rounded  border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
        />
      </label>

      {!!imageFiles.length && (
        <div className="my-4 rounded border-4 border-[hsl(0,0%,100%,0.6)] bg-black bg-opacity-20 p-4 text-white">
          <div className="flex justify-between">
            <h3 className="font-semibold italic">
              Selected Image Files{" "}
              <span className={filesSize > 3000000 ? "text-negative-200" : ""}>
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
              className="rounded bg-positive-700 px-4 py-2 font-bold text-white hover:bg-yellow-700"
              disabled={
                !imageFiles.length ||
                (uploadStatus !== "await" && uploadStatus !== "success")
              }
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleUpload();
              }}
            >
              Upload Images {uploadStatus} {imageFiles.length}
            </button>
            <button
              className="flex h-10 w-fit items-center justify-center rounded bg-negative-500 px-2 py-2 font-bold text-white hover:bg-negative-700 "
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
      {(!!previousImage.length ||
        !!imagesURL.length ||
        uploadStatus === "uploading") && (
        <div className="my-4 min-h-[260px] rounded bg-[#f3f4f6] bg-opacity-60 p-2">
          {!!previousImage.length && (
            <div id="previous-images-container" className="p-2 font-semibold">
              <h3 className="italic text-gray-900">Previous images</h3>
              <div className="flex flex-wrap items-stretch justify-stretch gap-4 py-4">
                {previousImage.map((imagesUrl, imageIndex) => (
                  <div
                    className={`
                         flex min-w-36 flex-col items-center  justify-between rounded border-2 border-green-900 p-2`}
                    key={imagesUrl.url}
                  >
                    <UploadImagePreview
                      imageUrl={imagesUrl.url}
                      imageFileName={imagesUrl.fileName}
                    >
                      <DeleteImageButton
                        imageIndex={imageIndex}
                        imageName={`${id}/${imagesUrl.fileName}`}
                        bucket="spielplaetze"
                        setImagesArray={setPreviousImage}
                      />
                      <DownloadImageButton
                        imageName={imagesUrl.fileName}
                        imageUrl={imagesUrl.url}
                      />
                    </UploadImagePreview>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!!imagesURL.length && (
            <div id="recent-images-container" className="p-2 font-semibold">
              <h3 className="italic text-gray-900">Recently uploaded image</h3>
              <div className="wrap flex items-stretch justify-stretch gap-4 py-4">
                {imagesURL.map((imagesUrl, imageIndex) => (
                  <div
                    className={`flex w-36 flex-col items-center justify-between rounded  border-2 border-green-900 p-2`}
                    key={imagesUrl.url}
                  >
                    <UploadImagePreview
                      imageUrl={imagesUrl.url}
                      imageFileName={imagesUrl.fileName}
                    >
                      <DeleteImageButton
                        imageIndex={imageIndex}
                        imageName={`${id}/${imagesUrl.fileName}`}
                        bucket="spielplaetze"
                        setImagesArray={setPreviousImage}
                      />
                    </UploadImagePreview>
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

export default SpielplatzImageUploader;
