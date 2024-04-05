"use server";
import {
  categoryName,
  iBezirk,
  iContributor,
  iParsedRetrievedPost,
  iPost,
  iSessionUser,
  iStringifiedRetrievedPost,
} from "@app/utils/types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { deleteUnusedImages } from "./storageActions";
import { parsePost } from "@app/utils/functions";
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

//images
export const getImageURL = async (bucket: string, path: string) =>
  supabaseAdmin.storage.from(bucket).getPublicUrl(path).data.publicUrl;

export const handleUploadToSupabase = async (
  path: string,
  file: File,
  orientation: "landscape" | "portrait"
) => {
  const { data, error } = await supabaseAdmin.storage
    .from(path)
    .upload(`public/${file.name}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    console.log("Error uploading file:", error.message);
  }
  const imageURL = await getImageURL(path, `public/${file.name}`);
  const metadata = {
    id: file.size + Math.floor(Math.random() * 1000000),
    name: file.name,
    href: imageURL,
    size: file.size,
    orientation,
  };
  const insertData = await supabaseAdmin.from(path).insert(metadata);

  return insertData;
};

//BLOGPOSTS

export const addBulkPosts = async (posts: iPost[]) => {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return "Not logged in";
    }
    const submittedPosts = posts.map((post) => ({
      ...post,
      addedBy: JSON.stringify(session.user),
      user_id: session.user?.email,
    }));
    const { data, error } = await supabaseAdmin
      .from("kih-suggestions")
      .insert(submittedPosts);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    throw new Error();
  }
};

// CONTRIBUTORS
export const getContributorData = async (email: string) => {
  const { data, error } = await supabaseAdmin
    .from("contributors")
    .select("*")
    .match({ id: email });
  if (error) {
    throw new Error(error.message);
  }
  return data[0] as iContributor;
};
export const addNewContributor = async (
  contributor: iSessionUser,
  postID: number
) => {
  try {
    const { error } = await supabaseAdmin.from("contributors").insert({
      id: contributor.email,
      name: contributor.name,
      email: contributor.email,
      image: contributor.image,
      firstContribution: [postID],
    });
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error();
  }
};

export const updateContributor = async (user: iSessionUser, postID: number) => {
  try {
    const contributor = await getContributorData(user.email!);
    if (!contributor) {
      addNewContributor(user, postID);
      return;
    }
    if (contributor.postSubmitted?.includes(postID)) return;
    const { error } = await supabaseAdmin
      .from("contributors")
      .update({
        postSubmitted: !!contributor.postSubmitted
          ? [...contributor.postSubmitted, postID]
          : [postID],
      })
      .match({ id: contributor.id });
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error();
  }
};

export const deleteContributor = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from("contributors")
    .delete()
    .match({ id });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// SUGGESTED BLOGPOSTS
export const addNewSuggestedPost = async (post: iParsedRetrievedPost) => {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return "Not logged in";
    }
    const submittedPost = {
      ...post,
      address: post.address ? JSON.stringify(post.address) : undefined,
      tags: post.tags ? JSON.stringify(post.tags) : undefined,
      categories: post.categories ? JSON.stringify(post.categories) : undefined,
      igAccounts: post.igAccounts ? JSON.stringify(post.igAccounts) : undefined,
      addedBy: post.addedBy ? JSON.stringify(post.addedBy) : undefined,
      image: post.image ? JSON.stringify(post.image) : undefined,
    };
    const { data, error } = await supabaseAdmin
      .from("kih-suggestions")
      .insert(submittedPost)
      .select();
    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    throw new Error();
  }
};

export const updateSuggestedPost = async (post: iParsedRetrievedPost) => {
  const { data, error } = await supabaseAdmin
    .from("kih-suggestions")
    .update(post)
    .match({ id: post.id });
  if (error) {
    throw new Error(error.message);
  }
  return true;
};

export const getSuggestedPostWithID = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from("kih-suggestions")
    .select("*")
    .match({ id });
  if (error) {
    throw new Error(error.message);
  }
  return data[0] as iStringifiedRetrievedPost;
};

export const getAllSuggestedPosts = async () => {
  const { data, error } = await supabaseAdmin
    .from("kih-suggestions")
    .select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data as iStringifiedRetrievedPost[];
};

export const getSuggestionsWithCat = async (category: string) => {
  const { data, error } = await supabaseAdmin
    .from("kih-suggestions")
    .select()
    .ilike("categories", `%${category}%`);
  if (error) {
    throw new Error(error.message);
  }
  return data as iStringifiedRetrievedPost[];
};

export const getSuggestionsWithCatAndBezirk = async (
  category: categoryName,
  bezirk: iBezirk
) => {
  const { data, error } = await supabaseAdmin
    .from("kih-suggestions")
    .select()
    .ilike("categories", `%${category}%`)
    .like("bezirk", bezirk);
  if (error) {
    throw new Error(error.message);
  }
  return data as iStringifiedRetrievedPost[];
};

export const getSuggestionsWithBezirk = async (bezirk: iBezirk) => {
  const { data, error } = await supabaseAdmin
    .from("kih-suggestions")
    .select("*")
    .in("bezirk", [bezirk]);
  if (error) {
    throw new Error(error.message);
  }
  return data.map((post) => parsePost(post)) as iParsedRetrievedPost[];
};

export const deleteSuggestion = async (id: number) => {
  const { data, error } = await supabaseAdmin
    .from("kih-suggestions")
    .delete()
    .match({ id });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getUsersSuggestions = async (email: string) => {
  const { data, error } = await supabaseAdmin
    .from("kih-suggestions")
    .select("*")
    .match({ user_id: email });
  if (error) {
    console.error(error.message);
    return "There was a problem getting your suggestions.";
  }
  return data as iStringifiedRetrievedPost[];
};
export const updateSuggestionStatus = async (id: number, status: string) => {
  const { data, error } = await supabaseAdmin
    .from("kih-suggestions")
    .update({ status })
    .match({ id });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// APPROVED BLOGPOSTS
export const getApprovedPostWithCat = async (category: string) => {
  const { data, error } = await supabaseAdmin
    .from("kih-approved-blogposts")
    .select()
    .ilike("categories", `%${category}%`);
  if (error) {
    throw new Error(error.message);
  }
  return data as iStringifiedRetrievedPost[];
};

export const getUserApprovedPosts = async (user: iSessionUser) => {
  const { data, error } = await supabaseAdmin
    .from("kih-approved-blogposts")
    .select("*")
    .match({ user_id: user.email });
  if (error) {
    throw new Error(error.message);
  }
  return data as iStringifiedRetrievedPost[];
};

export const getPostWithBezirk = async (bezirk: iBezirk) => {
  const { data, error } = await supabaseAdmin
    .from("kih-approved-blogposts")
    .select("*")
    .in("bezirk", [bezirk]);
  if (error) {
    throw new Error(error.message);
  }
  return data.map((post) => parsePost(post)) as iParsedRetrievedPost[];
};

export const getAllApprovedPosts = async () => {
  const { data, error } = await supabaseAdmin
    .from("kih-approved-blogposts")
    .select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data as iStringifiedRetrievedPost[];
};

export const getPinnedPosts = async () => {
  const { data, error } = await supabaseAdmin
    .from("kih-approved-blogposts")
    .select("*")
    .match({ pinnedPost: true });
  if (error) {
    throw new Error(error.message);
  }
  return data as iStringifiedRetrievedPost[];
};

export const getApprovedPostWithID = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from("kih-approved-blogposts")
    .select("*")
    .match({ id });
  if (error) {
    throw new Error(error.message);
  }
  return data[0] as iStringifiedRetrievedPost;
};

export const deleteApprovedPost = async (id: number) => {
  const { data, error } = await supabaseAdmin
    .from("kih-approved-blogposts")
    .delete()
    .match({ id });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getAllPostsIds = async () => {
  const getIDs = (db: string) => {
    return supabaseAdmin.from(db).select("id");
  };
  try {
    const data = await Promise.all(
      ["kih-approved-blogposts", "kih-suggestions"].map((folder) =>
        getIDs(folder)
      )
    );
    if (data.some((d) => d.error)) {
      throw new Error(data.find((d) => d.error)?.error?.message);
    }
    return data.map((d) => d.data!.map((d) => d.id)).flat();
  } catch (error) {
    throw new Error("error getting posts IDs");
  }
};

export const approveSuggestedPost = async (post: iParsedRetrievedPost) => {
  const { error } = await supabaseAdmin
    .from("kih-approved-blogposts")
    .insert(post);
  if (error) {
    throw new Error(error.message);
  }
  return true;
};

export const updateApprovedPost = async (post: iParsedRetrievedPost) => {
  const { error } = await supabaseAdmin
    .from("kih-approved-blogposts")
    .update(post)
    .match({ id: post.id });
  if (error) {
    throw new Error(error.message);
  }
  return true;
};

//POST SUBMIT HANDLES
export const handleUpdateSuggestion = async (
  updatedPost: iParsedRetrievedPost,
  setSubmitError: (
    value: React.SetStateAction<{
      isError: boolean;
      errorMessage: string;
    }>
  ) => void
) => {
  return updateSuggestedPost(updatedPost)
    .then(() => {
      setSubmitError({ isError: false, errorMessage: "" });
    })
    .then(() => {
      deleteUnusedImages();
    })
    .then(() => {
      updateContributor(updatedPost.addedBy, updatedPost.id);
    })
    .catch((error) =>
      setSubmitError({ isError: true, errorMessage: error.message })
    );
};

export const handleNewSuggestion = async (
  suggestion: iParsedRetrievedPost,
  setSubmitError: (
    value: React.SetStateAction<{
      isError: boolean;
      errorMessage: string;
    }>
  ) => void
) => {
  return addNewSuggestedPost(suggestion)
    .then(() => {
      setSubmitError({ isError: false, errorMessage: "" });
    })
    .then(() => {
      deleteUnusedImages();
    })
    .then(() => {
      addNewContributor(suggestion.addedBy, suggestion.id);
    })
    .catch((error) =>
      setSubmitError({ isError: true, errorMessage: error.message })
    );
};

export const handleApproveSuggestion = async (
  suggestion: iParsedRetrievedPost,
  setSubmitError: (
    value: React.SetStateAction<{
      isError: boolean;
      errorMessage: string;
    }>
  ) => void
) => {
  return approveSuggestedPost(suggestion)
    .then(() => {
      setSubmitError({ isError: false, errorMessage: "" });
    })
    .then(() => {
      deleteUnusedImages();
    })
    .then(() => {
      addNewContributor(suggestion.addedBy, suggestion.id);
    })
    .catch((error) =>
      setSubmitError({ isError: true, errorMessage: error.message })
    );
};

export const handleUpdateApprovedPost = async (
  updatedPost: iParsedRetrievedPost,
  setSubmitError: (
    value: React.SetStateAction<{
      isError: boolean;
      errorMessage: string;
    }>
  ) => void
) =>
  updateApprovedPost(updatedPost)
    .then(() => {
      setSubmitError({ isError: false, errorMessage: "" });
    })
    .then(() => {
      deleteUnusedImages();
    })
    .then(() => {
      updateContributor(updatedPost.addedBy, updatedPost.id);
    })
    .catch((error) =>
      setSubmitError({ isError: true, errorMessage: error.message })
    );
