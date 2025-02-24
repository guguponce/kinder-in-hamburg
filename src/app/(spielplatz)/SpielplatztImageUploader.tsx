"use client";
import React, { useEffect, useState } from "react";
import "firebase/storage";
import { convertAllFilesToWebp } from "@app/utils/functions";
import { iSessionUser } from "@app/utils/types";
import { handleUploadToSupabaseStorage } from "@app/api/storageActions";
import { getAllImagesURLFromSupabaseFolder } from "@app/api/spActions";
import ImageUploaderUI from "@app/components/@PostForm/ImageUploaderUI";

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
  const [localImageUrl, setLocalImageUrl] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    "await" | "uploading" | "success" | "error" | "paused" | "converting"
  >("await");

  const [error, setError] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllImagesURLFromSupabaseFolder("spielplaetze", id.toString())
      .then((prev) => {
        setPreviousImage(prev);
      })
      .catch((e) => {
        setError(e.message);
      });
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadStatus("converting");
    if (!e.target.files) return;
    const { urls, files } = await convertAllFilesToWebp(
      e.target.files,
      1200,
      300
    );

    setImageFiles((prev) => [...prev, ...files]);
    setLocalImageUrl((prev) => [...prev, ...urls]);
    setUploadStatus("await");
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
      setLocalImageUrl([]);

      fileInputRef.current!.value = "";
      setImagesURL((prev) => [...prev, ...urls]);
      setUploadStatus("success");
    } catch (e) {
      setUploadStatus("error");
    }
  };

  return (
    <ImageUploaderUI
      fileInputRef={fileInputRef}
      handleImageChange={handleImageChange}
      handleUpload={handleUpload}
      uploadStatus={uploadStatus}
      imageFiles={imageFiles}
      setImageFiles={setImageFiles}
      setLocalImageUrl={setLocalImageUrl}
      previousImagesURLS={previousImage}
      imagesURLS={imagesURL}
      id={id}
      localImageUrl={localImageUrl}
      maxMB={3}
      maxMBText="(Max. size for all images together: 3mb)"
      setImagesURLS={setImagesURL}
      setPreviousImagesURLS={setPreviousImage}
      type="spielplatz"
    />
  );
};

export default SpielplatzImageUploader;
