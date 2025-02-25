"use client";
import React, { useEffect, useState } from "react";
import "firebase/storage";
import { type FullMetadata } from "firebase/storage";
import { getImagesURLs, uploadPostImage } from "@app/api/storageActions";
import { convertAllFilesToWebp } from "@app/utils/functions";
import { ImageUploaderUI } from "./ImageUploaderUI";

interface ImageUploaderProps {
  setImagesUrlsReady: React.Dispatch<
    React.SetStateAction<{
      ready: boolean;
      urls: string[];
      metadata?: FullMetadata;
    }>
  >;
  id: number;
  email: string;
}

export const ImageUploader = ({
  id,
  setImagesUrlsReady,
  email,
}: ImageUploaderProps) => {
  const [previousImagesURLS, setPreviousImagesURLS] = useState<
    Array<{ url: string; fileName: string; metadata?: FullMetadata }>
  >([]);
  const [imageFiles, setImageFiles] = useState<Array<File>>([]);
  const [imagesURLS, setImagesURLS] = useState<
    Array<{ url: string; fileName: string; metadata?: FullMetadata }>
  >([]);
  const [localImageUrl, setLocalImageUrl] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    "await" | "uploading" | "success" | "error" | "paused" | "converting"
  >("await");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    getImagesURLs(`postsImages/${id}`).then((urls) => {
      setPreviousImagesURLS(urls);
    });
  }, [id]);

  useEffect(() => {
    if (!imageFiles.length) {
      setImagesUrlsReady({
        ready: true,
        urls: [...imagesURLS, ...previousImagesURLS].map((url) => url.url),
      });
    } else {
      setImagesUrlsReady((prev) => ({ ...prev, ready: false }));
    }
  }, [imagesURLS, setImagesUrlsReady, imageFiles, previousImagesURLS]);

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
        setLocalImageUrl([]);
      })
      .catch((error) => {
        throw new Error("Error in HandleUpload", error);
      });
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
      previousImagesURLS={previousImagesURLS}
      imagesURLS={imagesURLS}
      localImageUrl={localImageUrl}
      setImagesURLS={setImagesURLS}
      id={id}
      setPreviousImagesURLS={setPreviousImagesURLS}
      maxMB={3}
      maxMBText="(Max. size for all images together: 3mb)"
    />
  );
};

export default ImageUploader;
