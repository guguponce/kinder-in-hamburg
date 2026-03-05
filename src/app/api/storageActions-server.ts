"use server";
import { createClient } from "@auth/server";
import React from "react";
import { getAllEventsIds, getAllPostsIds } from "@app/api/dbActions";
import { imageDataURLSetter } from "@app/utils/types";

//   GET
// Get all folders names (postIDs) in the postsImages bucket
export const getFoldersList = async (bucket: string) => {
  const supabaseAdminClient = createClient();
  try {
    const { data } = await supabaseAdminClient.storage
      .from(bucket)
      .list("", { limit: 1000, offset: 0 });
    const imgFoldersNames = (data || []).map(({ name }) => name.split("/")[0]);
    return imgFoldersNames;
  } catch (error) {
    console.error("Error getting folders list:", error);
    return [];
  }
};

//   Get all imagesURLs in a folder
export const getImagesURLs = async (bucket: string, path: string) => {
  const supabaseAdminClient = createClient();
  try {
    const { data, error } = await supabaseAdminClient.storage
      .from(bucket)
      .list(path);
    if (error) {
      throw new Error(`Error listing images: ${error.message}`);
    }
    const imageURLs = data.map((item) => {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${path}/${item.name}`;
      return {
        url,
        fileName: item.name,
        metadata: {
          name: item.name,
          size: item.metadata?.size || 0,
          updated: item.updated_at,
        },
      };
    });
    return imageURLs;
  } catch (error) {
    console.error("Error getting images URLs:", error);
    return [];
  }
};

//   DELETE
export const deleteImage = async (
  bucket: string,
  path: string | number,
  fileName: string,
) => {
  const supabaseAdminClient = createClient();
  try {
    const { data, error } = await supabaseAdminClient.storage
      .from(bucket)
      .remove([`${path}/${fileName}`]);

    if (error) {
      console.error("Error deleting image from Supabase:", error.message);
    }
  } catch (error) {
    console.error("Error deleting image from Supabase:", error);
  }
};

export const deleteAllImagesFromPost = async (id: string) => {
  const images = await getImagesURLs("posts", id);
  await Promise.all(
    images.map(async (image) => {
      return deleteImage("posts", id, image.fileName);
    }),
  );
};

export const deleteUnusedPostsImages = async (id?: string) => {
  const activePosts = (await getAllPostsIds(id)) || [];

  const allImgFolders = (await getFoldersList("posts")) || [];
  const deletableFolders = allImgFolders.filter(
    (folder) => !activePosts.includes(folder),
  );

  // Promise.all(
  //   deletableFolders.map(async (id) => {
  //     return listAll(ref(storage, `postsImages/${id}`)).then((res) => {
  //       res.items.forEach(async (item) => {
  //         await deleteImage("posts", id, item.name);
  //       });
  //     });
  //   }),
  // );
};

// FLOHMAERKTE
//   GET
// Get all folders names (postIDs) in the postsImages bucket
// export const getFlohmaerkteFoldersListInFirebase = async () => {
//   const listRef = ref(storage, `/flohmaerkteImages`);
//   const imagesList = await listAll(listRef);
//   const imgFoldersNames = imagesList.prefixes.map((item) =>
//     parseInt(item.name),
//   );
//   return imgFoldersNames;
// };
export const getFlohmaerkteFoldersList = async () => {
  const supabaseAdminClient = createClient();
  try {
    const { data } = await supabaseAdminClient.storage
      .from("flohmaerkte")
      .list("", { limit: 1000, offset: 0 });
    const imgFoldersNames = (data || []).map(({ name }) => name.split("/")[0]);
    return imgFoldersNames;
  } catch (error) {
    console.error("Error listing folders in Supabase:", error);
    return [];
  }
};

//Get all imagesURLs in a folder
export const getFlohmaerkteImagesURLs = async (path: string) => {
  const supabaseAdminClient = createClient();
  try {
    const { data, error } = await supabaseAdminClient.storage
      .from("flohmaerkte")
      .list(path);
    if (error) {
      throw new Error(`Error listing images: ${error.message}`);
    }

    const imageURLs = data.map((item) => {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/flohmaerkte/${path}/${item.name}`;
      return {
        url,
        fileName: item.name,
        metadata: {
          size: item.metadata?.size || 0,
          updated: item.updated_at,
        },
      };
    });

    return imageURLs;
  } catch (error) {
    console.error("Error getting images URLs:", error);
    return [];
  }
};

//   DELETE

export const deleteFlohmaerkteImage = async (
  path: string,
  fileName: string,
) => {
  const supabaseAdminClient = createClient();
  try {
    const { error } = await supabaseAdminClient.storage
      .from("flohmaerkte")
      .remove([`${path}/${fileName}`]);
    if (error) {
      console.error("Error deleting image from Supabase:", error.message);
    }
  } catch (error) {
    console.error("Error deleting image from Supabase:", error);
  }
};

export const deletePreviousFlohmaerkteImages = async (id: number) => {
  const images = await getFlohmaerkteImagesURLs(id.toString());
  await Promise.all(
    images.map(async (image) => {
      return deleteFlohmaerkteImage(id.toString(), image.fileName);
    }),
  );
};

const deleteUnusedFolders = async (
  bucket: string,
  deletableFolders: string[],
) => {
  const supabaseAdminClient = createClient();
  return await Promise.all(
    deletableFolders.map(async (folder) => {
      const { data, error } = await supabaseAdminClient.storage
        .from(bucket)
        .list(folder);

      if (error) {
        console.error(`Error listing folder ${folder}`, error);
        return { id: folder, error: `Error listing folder ${folder}` };
      }

      if (!data || data.length === 0) {
        console.warn(`Folder ${folder} is empty`);
        return { id: folder, error: `Folder ${folder} is empty` };
      }

      await Promise.all(
        data.map(async (item) => {
          const filePath = `${folder}/${item.name}`;

          const { error: deleteError } = await supabaseAdminClient.storage
            .from(bucket)
            .remove([filePath]);

          if (deleteError) {
            console.error(`Error deleting ${filePath}`, deleteError);
            return { id: folder, error: `Error deleting ${filePath}` };
          }
        }),
      );
      return { id: folder, error: null };
    }),
  );
};
export const deleteUnusedFlohmaerkteImages = async () => {
  const activeEvents = (await getAllEventsIds()) || [];
  const allImgFolders = await getFlohmaerkteFoldersList();
  const deletableFolders = allImgFolders.filter(
    (folder) => !activeEvents.includes(parseInt(folder)),
  );
  const deletionResults = await deleteUnusedFolders(
    "flohmaerkte",
    deletableFolders,
  );
  return deletionResults;
};
