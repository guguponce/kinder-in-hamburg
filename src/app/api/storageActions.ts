import React from "react";
import { getAllPostsIds } from "@app/api/dbActions";
import {
  FullMetadata,
  deleteObject,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "./firebase";

//POST
export const uploadPostImage = async (
  userEmail: string,
  id: string,
  file: File,
  imgUrlsSetter: React.Dispatch<
    React.SetStateAction<
      Array<{ url: string; fileName: string; metadata: FullMetadata }>
    >
  >,
  statusSetter: React.Dispatch<
    React.SetStateAction<"uploading" | "success" | "error" | "paused" | "await">
  >
) => {
  console.log("u");
  // Create Metadata
  const metadata = {
    contentType: file.type,
    size: file.size,
    name: file.name,
    postID: id,
    uploadedBy: userEmail,
  };

  const storageRef = ref(storage, `postsImages/${id}/${file.name}`);
  // Upload file and get status
  return new Promise(async (res, rej) => {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress === 100) console.log("Upload is done");
        switch (snapshot.state) {
          case "paused":
            statusSetter("paused");
            break;
          case "running":
            statusSetter("uploading");
            break;
        }
      },
      (error) => {
        statusSetter("error");
      },
      // After uploaded get metadata and download URL
      async () => {
        const metadata = await getMetadata(uploadTask.snapshot.ref);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          imgUrlsSetter((prev) => [
            ...prev,
            { url: downloadURL, fileName: file.name, metadata },
          ]);
        });
        statusSetter("await");
        res("success");
      }
    );
  });
};

//   GET
// Get all folders names (postIDs) in the postsImages bucket
export const getFoldersList = async () => {
  const listRef = ref(storage, `/postImages`);
  const imagesList = await listAll(listRef);
  const imgFoldersNames = imagesList.prefixes.map((item) => item.name);
  return imgFoldersNames;
};

//   Get all imagesURLs in a folder
export const getImagesURLs = async (path: string) => {
  const imagesRef = ref(storage, path);

  try {
    const imageList = await listAll(imagesRef);

    const imageURLs = await Promise.all(
      imageList.items.map(async (imageRef) => {
        const metadata = await getMetadata(imageRef);
        const url = await getDownloadURL(imageRef);
        return { url, fileName: imageRef.name, metadata };
      })
    );

    return imageURLs;
  } catch (error) {
    // Handle error
    console.error("Error getting images URLs:", error);
    return [];
  }
};

//   DELETE
export const deleteImage = async (path: string, fileName: string) => {
  const imageRef = ref(storage, `${path}/${fileName}`);
  try {
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export const deleteUnusedImages = async () => {
  //Get all active posts IDs in db
  const activePosts = await getAllPostsIds().then((res) => res);
  //Get all folders names (IDs) in the bucket
  const allImgFolders = await getFoldersList().then((res) => res);
  //Filter out the active posts IDs
  const deletableFolders = allImgFolders.filter(
    (folder) => !activePosts.includes(folder)
  );
  Promise.all(
    deletableFolders.map(async (folder) => {
      return listAll(ref(storage, `postsImages/${folder}`)).then((res) => {
        res.items.forEach(async (item) => {
          deleteImage(`postsImages/${folder}`, item.name);
        });
      });
    })
  ).then(() => console.log("Unused images deleted"));
};
