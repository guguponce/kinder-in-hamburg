import { createClient } from "@auth/client";
import React from "react";
import { getAllEventsIds, getAllPostsIds } from "@app/api/dbActions";
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
import { imageDataURLSetter, iSessionUser } from "@app/utils/types";

//POST
export const uploadPostImage = async (
  userEmail: string,
  id: string,
  file: File,
  imgUrlsSetter: imageDataURLSetter,
  statusSetter: React.Dispatch<
    React.SetStateAction<
      "uploading" | "success" | "error" | "paused" | "await" | "converting"
    >
  >
) => {
  // Create Metadata
  const metadata = {
    contentType: file.type,
    size: file.size,
    name: file.name,
    customMetadata: {
      postID: id.toString(),
      uploadedBy: userEmail,
    },
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
          imgUrlsSetter((prev) => {
            return [
              ...prev,
              { url: downloadURL, fileName: file.name, metadata },
            ];
          });
        });
        statusSetter("await");
        res("success");
      }
    );
  });
};

//   GET
// Get all folders names (postIDs) in the postsImages bucket
export const getFoldersList = async (
  firebaseFolder: "postsImages" | "flohmaerkteImages" = "postsImages"
) => {
  const listRef = ref(storage, firebaseFolder);
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

export const deleteAllImagesFromPost = async (id: string) => {
  const images = await getImagesURLs(`postsImages/${id}`);
  await Promise.all(
    images.map(async (image) => {
      return deleteImage(`postsImages/${id}`, image.fileName);
    })
  );
};

export const deleteUnusedPostsImages = async (id?: string) => {
  const activePosts = await getAllPostsIds(id).then((res) => res || []);

  const allImgFolders = await getFoldersList().then((res) => res);
  const deletableFolders = allImgFolders.filter(
    (folder) => !activePosts.includes(parseInt(folder))
  );
  Promise.all(
    deletableFolders.map(async (id) => {
      return listAll(ref(storage, `postsImages/${id}`)).then((res) => {
        res.items.forEach(async (item) => {
          await deleteImage(`postsImages/${id}`, item.name);
        });
      });
    })
  );
};

// FLOHMAERKTE
export const uploadFlohmarktImage = async (
  userEmail: iSessionUser,
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
  // Create Metadata
  const metadata = {
    contentType: file.type,
    size: file.size,
    name: file.name,
    postID: id,
    uploadedBy: JSON.stringify({
      email: userEmail.email,
      name: userEmail.name,
    }),
  };

  const storageRef = ref(storage, `flohmaerkteImages/${id}/${file.name}`);
  // Upload file and get status
  return new Promise(async (res, rej) => {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
          imgUrlsSetter([{ url: downloadURL, fileName: file.name, metadata }]);
        });
        statusSetter("await");
        res("success");
      }
    );
  });
};

//   GET
// Get all folders names (postIDs) in the postsImages bucket
export const getFlohmaerkteFoldersList = async () => {
  const listRef = ref(storage, `/flohmaerkteImages`);
  const imagesList = await listAll(listRef);
  const imgFoldersNames = imagesList.prefixes.map((item) =>
    parseInt(item.name)
  );
  return imgFoldersNames;
};

//   Get all imagesURLs in a folder
export const getFlohmaerkteImagesURLs = async (path: string) => {
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
    throw new Error("Error getting images URLs:", error || "");
    return [];
  }
};

//   DELETE
export const deleteFlohmaerkteImage = async (
  path: string,
  fileName: string
) => {
  const imageRef = ref(storage, `${path}/${fileName}`);
  try {
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export const deletePreviousFlohmaerkteImages = async (id: number) => {
  const images = await getFlohmaerkteImagesURLs(`flohmaerkteImages/${id}`);
  await Promise.all(
    images.map(async (image) => {
      return deleteFlohmaerkteImage(`flohmaerkteImages/${id}`, image.fileName);
    })
  );
};

export const deleteUnusedFlohmaerkteImages = async () => {
  const activeFlohmaerkte = await getAllEventsIds().then((res) => res || []);

  const allImgFolders = await getFlohmaerkteFoldersList();
  const deletableFolders = allImgFolders.filter(
    (folder) => !activeFlohmaerkte.includes(folder)
  );
  Promise.all(
    deletableFolders.map(async (folder) => {
      return listAll(ref(storage, `flohmaerkteImages/${folder}`)).then(
        (res) => {
          res.items.forEach(async (item) => {
            deleteFlohmaerkteImage(`flohmaerkteImages/${folder}`, item.name);
          });
        }
      );
    })
  );
};

//SUPABASE
//POST

export async function handleUploadToSupabaseStorage(
  id: number | string,
  bucket: string,
  file: File,
  folder?: string
) {
  const supabaseAdminClient = createClient();
  const path = folder ? `${folder}/${file.name}` : `${id}/${file.name}`;
  try {
    const { data, error } = await supabaseAdminClient.storage
      .from("spielplaetze")
      .upload(path, file);
    if (error) {
      console.error("Supabase upload error details:", error);
      return { data: null, error: "File uploading failed" };
    }
    const imgURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}`;
    return { data: { url: imgURL, fileName: file.name }, error: null };
  } catch (error) {
    console.error("Supabase upload error details:", error);
    return { data: null, error: "File uploading failed" };
  }
}
