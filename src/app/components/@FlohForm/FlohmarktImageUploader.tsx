"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  deletePreviousFlohmaerkteImages,
  getFlohmaerkteImagesURLs,
} from "@app/api/storageActions-server";
import { uploadFlohmarktImage } from "@app/api/storageActions-client";
import { iSessionUser } from "@app/utils/types";
import { convertToWebp } from "@app/utils/functions";
import ImageUploaderUI from "../@PostForm/ImageUploaderUI";

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

const ImageUploader = ({
  id,
  setImagesUrlsReady,
  user,
}: ImageUploaderProps) => {
  const [previousImage, setPreviousImage] = useState<
    Array<{ url: string; fileName: string; metadata?: Record<string, any> }>
  >([]);
  const [imageFile, setImageFile] = useState<Array<File>>([]);
  const [localImageUrl, setLocalImageUrl] = useState<string[]>([]);
  const [imageURL, setImageURL] = useState<
    Array<{ url: string; fileName: string; metadata?: Record<string, any> }>
  >([]);
  const [uploadStatus, setUploadStatus] = useState<
    "await" | "uploading" | "success" | "error" | "paused"
  >("await");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    getFlohmaerkteImagesURLs(`${id}`).then((url) => {
      setPreviousImage(url);
    });
  }, [id]);

  useEffect(() => {
    if (!imageFile.length) {
      setImagesUrlsReady({
        ready: true,
        urls: [...imageURL, ...previousImage].map((url) => url.url),
      });
    } else {
      setImagesUrlsReady((prev) => ({ ...prev, ready: false }));
    }
  }, [imageURL, setImagesUrlsReady, imageFile, previousImage]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      convertToWebp(
        event.target.files[0],
        400,
        40,
        setImageFile,
        setLocalImageUrl,
      );
    }
  };
  const handleUpload = async () => {
    await deletePreviousFlohmaerkteImages(id)
      .then(() => {
        setPreviousImage([]);
      })
      .catch((error) => {
        throw new Error("Error deleting previous Flohmärkte images", error);
      });
    if (!user.email) {
      throw new Error("User email is required for uploading images");
    }
    if (!user.name) {
      throw new Error("User name is required for uploading images");
    }
    Promise.all(
      imageFile.map((image) => {
        uploadFlohmarktImage(
          user.email as string,
          user.name as string,
          id.toString(),
          image,
          setImageURL,
          setUploadStatus,
        );
      }),
    )
      .then(() => {
        setImageFile([]);
        setLocalImageUrl([]);
        fileInputRef.current!.value = "";
      })
      .catch((error) => {
        throw new Error("Error in HandleUpload", error);
      });
  };
  const filesSize = useMemo(
    () => imageFile.reduce((acc, { size }) => acc + size, 0),
    [imageFile],
  );

  return (
    <>
      <ImageUploaderUI
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        handleUpload={handleUpload}
        uploadStatus={uploadStatus}
        imageFiles={imageFile}
        setImageFiles={setImageFile}
        setImagesURLS={setImageURL}
        setLocalImageUrl={setLocalImageUrl}
        previousImagesURLS={previousImage}
        imagesURLS={imageURL}
        id={id}
        localImageUrl={localImageUrl}
        maxMB={1}
        maxMBText="(Max. size image: 1mb)"
        setPreviousImagesURLS={setPreviousImage}
        type="flohmarkt"
      />
    </>
  );
};

export default ImageUploader;
