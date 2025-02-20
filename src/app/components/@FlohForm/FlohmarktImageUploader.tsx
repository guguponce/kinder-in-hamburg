"use client";
import React, { useEffect, useMemo, useState } from "react";
import "firebase/storage";
import DownloadImageButton from "../@PostForm/DownloadImageButton";
import DeleteImageButton from "../@PostForm/DeleteImageButton";
import UploadImagePreview from "../@PostForm/UploadImagePreview";
import { type FullMetadata } from "firebase/storage";
import {
  deletePreviousFlohmaerkteImages,
  getFlohmaerkteImagesURLs,
  uploadFlohmarktImage,
} from "@app/api/storageActions";
import { iSessionUser } from "@app/utils/types";

const createBlob = (dataUrl: string) => {
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return new File([blob], "image.webp", {
    type: "image/webp",
  });
};
const reduceQualityUnderSpecificKb = (
  canvas: HTMLCanvasElement,
  kb: number,
  minQuality: number = 0.5
) => {
  let finalFile: File | undefined = undefined;
  let url: string | undefined = undefined;
  let quality = 1;
  while (quality > minQuality && !finalFile) {
    const dataUrl = canvas.toDataURL("image/webp", quality);
    const file = new File([dataUrl], "image.webp", {
      type: "image/webp",
    });
    if (file.size < kb * 1000 || quality <= minQuality + 0.05) {
      finalFile = file;
      url = dataUrl;
    }
    quality -= 0.1;
  }
  return { file: finalFile, url };
};

// const reduceSizeSpecificKb = (
//   img: HTMLImageElement,
//   minWidth: number,
//   kb: number
// ) => {
//   let finalFile: File | undefined = undefined;
//   let url: string | undefined = undefined;
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");
//   if (ctx) {
//     ctx.imageSmoothingEnabled = true;
//     ctx.imageSmoothingQuality = "high";
//     let width = img.width;
//     let height = img.height;

//     while (!finalFile && width > minWidth - 100) {
//       if (width - 100 < minWidth) {
//         canvas.width = minWidth;
//         const newHeight = img.height * (minWidth / img.width);
//         canvas.height = newHeight;
//         ctx.drawImage(img, 0, 0, minWidth, newHeight);
//         const dataUrl = canvas.toDataURL("image/webp", 0.7);
//         const file = new File([dataUrl], "image.webp", {
//           type: "image/webp",
//         });
//         finalFile = file;
//         url = dataUrl;
//         return {
//           file,
//           url,
//         };
//       } else {
//         canvas.width = width;
//         const newHeight = height * (width / img.width);
//         canvas.height = newHeight;
//         ctx.drawImage(img, 0, 0, width, newHeight);
//       }
//       const dataUrl = canvas.toDataURL("image/webp", 0.7);
//       const file = new File([dataUrl], "image.webp", {
//         type: "image/webp",
//       });
//       if (file.size < kb * 1000) {
//         finalFile = file;
//         url = dataUrl;
//       }
//       if (width > 2000) {
//         width = 2000;
//       } else {
//         width = width - 100;
//       }
//     }

//     return {
//       file: finalFile,
//       url,
//     };
//   }
// };

async function convertToWebp(
  file: File,
  maxWidth: number,
  maxFileKb: number,
  fileSetter: React.Dispatch<React.SetStateAction<File[]>>,
  urlSetter: React.Dispatch<React.SetStateAction<string[]>>
) {
  const url = URL.createObjectURL(file);
  if (file.size < maxFileKb * 1000) {
    fileSetter((prev) => [...prev, file]);
    urlSetter((prev) => [...prev, url]);
    return;
  }
  const img = new Image();
  img.src = url;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const newWidth = img.width > maxWidth ? maxWidth : img.width;
      const newHeight = newWidth * (img.height / img.width);
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const { url } = reduceQualityUnderSpecificKb(canvas, maxFileKb);
      if (url) {
        const file = createBlob(url);
        fileSetter((prev) => [...prev, file]);
        urlSetter((prev) => [...prev, url]);
      } else {
        console.log("Error in convertToWebp", file, url);
      }
    }
  };
}

// async function convertToWebpHalfQuality(
//   file: File,
//   minWidth: number,
//   maxFileKb: number,
//   fileSetter: React.Dispatch<React.SetStateAction<File[]>>,
//   urlSetter: React.Dispatch<React.SetStateAction<string[]>>
// ) {
//   const url = URL.createObjectURL(file);
//   if (file.size < maxFileKb * 1000) {
//     fileSetter((prev) => [...prev, file]);
//     urlSetter((prev) => [...prev, url]);
//     return;
//   }
//   const img = new Image();
//   img.src = url;
//   img.onload = () => {
//     const reduced = reduceSizeSpecificKb(img, minWidth, maxFileKb);
//     if (!!reduced?.file && reduced?.url) {
//       fileSetter((prev) => [...prev, reduced.file!]);
//       urlSetter((prev) => [...prev, reduced.url!]);
//       console.log("reduced", reduced.file.size);
//     } else {
//       console.log("reduced", reduced);
//     }
//   };
// }

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
    Array<{ url: string; fileName: string; metadata: FullMetadata }>
  >([]);
  const [imageFile, setImageFile] = useState<Array<File>>([]);
  const [localImageUrl, setLocalImageUrl] = useState<string[]>([]);
  const [imageURL, setImageURL] = useState<
    Array<{ url: string; fileName: string; metadata: FullMetadata }>
  >([]);
  const [uploadStatus, setUploadStatus] = useState<
    "await" | "uploading" | "success" | "error" | "paused"
  >("await");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    getFlohmaerkteImagesURLs(`flohmaerkteImages/${id}`).then((url) => {
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
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const convertedImage = await convertToWebp(
        event.target.files[0],
        400,
        40,
        setImageFile,
        setLocalImageUrl
      );
    }
  };
  const handleUpload = async () => {
    await deletePreviousFlohmaerkteImages(id)
      .then(() => {
        setPreviousImage([]);
      })
      .catch((error) => {
        throw new Error("Error in HandleUpload", error);
      });

    Promise.all(
      imageFile.map((image) => {
        uploadFlohmarktImage(
          user,
          id.toString(),
          image,
          setImageURL,
          setUploadStatus
        );
      })
    )
      .then(() => {
        setImageFile([]);
        fileInputRef.current!.value = "";
      })
      .catch((error) => {
        throw new Error("Error in HandleUpload", error);
      });
  };
  const filesSize = useMemo(
    () => imageFile.reduce((acc, { size }) => acc + size, 0),
    [imageFile]
  );

  return (
    <div
      id="images-upload-container"
      className="bg-hh-800 p-4 text-gray-900 max-w-[800px] mx-auto text-sm"
    >
      <h2 className="text-xl font-bold text-white underline">
        Image<span className="ml-2 text-negative-200 no-underline">*</span>
        <span className="text-sm text-negative-200 no-underline">
          (Max. size: 3mb)
        </span>
      </h2>

      <label htmlFor="images" className="text-sm leading-7 text-gray-100">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          name="images"
          onChange={handleImageChange}
          className="mt-4 flex max-w-[300px] flex-wrap rounded  border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
        />
      </label>

      {!!imageFile.length && (
        <div className="my-4 rounded border-4 border-hh-100 bg-hh-950 bg-opacity-25 px-4 py-2 flex flex-col gap-2 text-white">
          <div className="flex justify-between">
            <h3 className="font-semibold italic">
              Selected Image File{" "}
              <span className={filesSize > 3000000 ? "text-negative-200" : ""}>
                (full size: {(filesSize / 1000000).toFixed(2)}
                mb)
              </span>
            </h3>
            (status: {uploadStatus === "await" ? "not uploaded" : uploadStatus})
          </div>
          <ol className="list-decimal flex flex-wrap gap-2 items-center">
            {imageFile.map((image, i) => (
              <li
                className="ml-6 flex flex-col items-center gap-1"
                key={image.name + image.size}
              >
                <img
                  src={localImageUrl[i]}
                  alt={image.name}
                  className="w-36 h-36 object-cover"
                />
                <p>
                  {image.size > 1000000
                    ? `(${(image.size / 1000000).toFixed(2)} mb)`
                    : `(${(image.size / 1000).toFixed(2)} kb)`}
                </p>
              </li>
            ))}
          </ol>
          <div className="flex gap-4">
            <button
              className="rounded bg-positive-700 px-4 py-2 font-bold text-white hover:bg-yellow-700"
              disabled={
                !imageFile.length ||
                (uploadStatus !== "await" && uploadStatus !== "success")
              }
              onClick={() => handleUpload()}
            >
              Upload Images
            </button>
            <button
              className="flex h-10 w-fit items-center justify-center rounded bg-negative-500 px-2 py-2 font-bold text-white hover:bg-negative-700 "
              onClick={() => {
                setImageFile([]);
                fileInputRef.current!.value = "";
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {(!!previousImage.length ||
        !!imageURL.length ||
        uploadStatus === "uploading") && (
        <div className="my-4 min-h-[260px] rounded bg-[hsl(220,14%,96%)] bg-opacity-60 p-2">
          {!!previousImage.length && (
            <div id="previous-images-container" className="p-2 font-semibold">
              <h3 className="italic text-gray-900">Previous images</h3>
              <div className="flex flex-wrap items-stretch justify-stretch gap-4 py-4">
                {previousImage.map((imageUrl, imageIndex) => (
                  <div
                    className={`
                         flex min-w-36 flex-col items-center  justify-between rounded border-2 border-green-900 p-2`}
                    key={imageUrl.url}
                  >
                    <UploadImagePreview
                      imageUrl={imageUrl.url}
                      imageFileName={imageUrl.fileName}
                    >
                      <DeleteImageButton
                        imageIndex={imageIndex}
                        imageName={imageUrl.fileName}
                        path={`flohmaerkteImages/${id}`}
                        setImagesArray={setPreviousImage}
                      />
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
          {!!imageURL.length && (
            <div id="recent-images-container" className="p-2 font-semibold">
              <h3 className="italic text-gray-900">Recently uploaded image</h3>
              <div className="wrap flex items-stretch justify-stretch gap-4 py-4">
                {imageURL.map((imageUrl, imageIndex) => (
                  <div
                    className={`flex w-36 flex-col items-center justify-between rounded  border-2 border-green-900 p-2`}
                    key={imageUrl.url}
                  >
                    <UploadImagePreview
                      imageUrl={imageUrl.url}
                      imageFileName={imageUrl.fileName}
                    >
                      <DeleteImageButton
                        imageIndex={imageIndex}
                        imageName={imageUrl.fileName}
                        path={`flohmaerkteImages/${id}`}
                        setImagesArray={setImageURL}
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

export default ImageUploader;

/*
"use client";
import React, { useEffect, useMemo, useState } from "react";
import "firebase/storage";
import DownloadImageButton from "../@PostForm/DownloadImageButton";
import DeleteImageButton from "../@PostForm/DeleteImageButton";
import UploadImagePreview from "../@PostForm/UploadImagePreview";
import { type FullMetadata } from "firebase/storage";
import {
  deletePreviousFlohmaerkteImages,
  getFlohmaerkteImagesURLs,
  uploadFlohmarktImage,
} from "@app/api/storageActions";
import { filterExtraImages } from "@app/utils/functions";
import { iSessionUser } from "@app/utils/types";

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
    Array<{ url: string; fileName: string; metadata: FullMetadata }>
  >([]);
  const [imageFile, setImageFile] = useState<Array<File>>([]);
  const [imageURL, setImageURL] = useState<
    Array<{ url: string; fileName: string; metadata: FullMetadata }>
  >([]);
  const [uploadStatus, setUploadStatus] = useState<
    "await" | "uploading" | "success" | "error" | "paused"
  >("await");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    getFlohmaerkteImagesURLs(`flohmaerkteImages/${id}`).then((url) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImages = filterExtraImages(
      Array.from(e.target.files as FileList)
    );
    setImageFile(selectedImages);
  };

  const handleUpload = async () => {
    await deletePreviousFlohmaerkteImages(id)
      .then(() => {
        setPreviousImage([]);
      })
      .catch((error) => {
        throw new Error("Error in HandleUpload", error);
      });

    Promise.all(
      imageFile.map((image) => {
        uploadFlohmarktImage(
          user,
          id.toString(),
          image,
          setImageURL,
          setUploadStatus
        );
      })
    )
      .then(() => {
        setImageFile([]);
        fileInputRef.current!.value = "";
      })
      .catch((error) => {
        throw new Error("Error in HandleUpload", error);
      });
  };
  const filesSize = useMemo(
    () => imageFile.reduce((acc, { size }) => acc + size, 0),
    [imageFile]
  );

  return (
    <div
      id="images-upload-container"
      className="bg-hh-800 p-4 text-gray-900 max-w-[800px] mx-auto text-sm"
    >
      <h2 className="text-xl font-bold text-white underline">
        Image<span className="ml-2 text-negative-200 no-underline">*</span>
        <span className="text-sm text-negative-200 no-underline">
          (Max. size: 3mb)
        </span>
      </h2>

      <label htmlFor="images" className="text-sm leading-7 text-gray-100">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          name="images"
          onChange={handleImageChange}
          className="mt-4 flex max-w-[300px] flex-wrap rounded  border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
        />
      </label>

      {!!imageFile.length && (
        <div className="my-4 rounded border-4 border-[hsl(0,0%,100%,0.6)] bg-black bg-opacity-20 p-4 text-white">
          <div className="flex justify-between">
            <h3 className="font-semibold italic">
              Selected Image File{" "}
              <span className={filesSize > 3000000 ? "text-negative-200" : ""}>
                (full size: {(filesSize / 1000000).toFixed(2)}
                mb)
              </span>
            </h3>
            (status: {uploadStatus === "await" ? "not uploaded" : uploadStatus})
          </div>
          <ol className="list-decimal">
            {imageFile.map((image) => (
              <li className="ml-6" key={image.name}>
                {image.name} - ({`${(image.size / 1000000).toFixed(2)} mb`})
              </li>
            ))}
          </ol>
          <div className="my-4 flex gap-4">
            <button
              className="rounded bg-positive-700 px-4 py-2 font-bold text-white hover:bg-yellow-700"
              disabled={
                !imageFile.length ||
                (uploadStatus !== "await" && uploadStatus !== "success")
              }
              onClick={() => handleUpload()}
            >
              Upload Images
            </button>
            <button
              className="flex h-10 w-fit items-center justify-center rounded bg-negative-500 px-2 py-2 font-bold text-white hover:bg-negative-700 "
              onClick={() => {
                setImageFile([]);
                fileInputRef.current!.value = "";
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {(!!previousImage.length ||
        !!imageURL.length ||
        uploadStatus === "uploading") && (
        <div className="my-4 min-h-[260px] rounded bg-[hsl(220,14%,96%)] bg-opacity-60 p-2">
          {!!previousImage.length && (
            <div id="previous-images-container" className="p-2 font-semibold">
              <h3 className="italic text-gray-900">Previous images</h3>
              <div className="flex flex-wrap items-stretch justify-stretch gap-4 py-4">
                {previousImage.map((imageUrl, imageIndex) => (
                  <div
                    className={`
                         flex min-w-36 flex-col items-center  justify-between rounded border-2 border-green-900 p-2`}
                    key={imageUrl.url}
                  >
                    <UploadImagePreview
                      imageUrl={imageUrl.url}
                      imageFileName={imageUrl.fileName}
                    >
                      <DeleteImageButton
                        imageIndex={imageIndex}
                        imageName={imageUrl.fileName}
                        path={`flohmaerkteImages/${id}`}
                        setImagesArray={setPreviousImage}
                      />
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
          {!!imageURL.length && (
            <div id="recent-images-container" className="p-2 font-semibold">
              <h3 className="italic text-gray-900">Recently uploaded image</h3>
              <div className="wrap flex items-stretch justify-stretch gap-4 py-4">
                {imageURL.map((imageUrl, imageIndex) => (
                  <div
                    className={`flex w-36 flex-col items-center justify-between rounded  border-2 border-green-900 p-2`}
                    key={imageUrl.url}
                  >
                    <UploadImagePreview
                      imageUrl={imageUrl.url}
                      imageFileName={imageUrl.fileName}
                    >
                      <DeleteImageButton
                        imageIndex={imageIndex}
                        imageName={imageUrl.fileName}
                        path={`flohmaerkteImages/${id}`}
                        setImagesArray={setImageURL}
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

export default ImageUploader;

*/
