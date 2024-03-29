"use server";
import {
  iContributor,
  iParsedRetrievedPost,
  iPost,
  iSessionUser,
  iStringifiedRetrievedPost,
} from "@app/utils/types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
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
  } else {
    console.log("File uploaded successfully:", data);
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
  console.log("inserData", insertData);
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
      .from("kinder-in-hh-blogposts")
      .insert(submittedPosts);
    if (error) {
      throw new Error(error.message);
    }
    console.log("submitted");
    return data;
  } catch (error) {
    throw new Error();
  }
};

export const getContributorData = async (email: string) => {
  console.log(email);
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
    console.log("contributor", contributor);
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

export const addNewPost = async (post: iParsedRetrievedPost) => {
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
      .from("kinder-in-hh-blogposts")
      .insert(submittedPost)
      .select();
    if (error) {
      throw new Error(error.message);
    }
    console.log("submitted");

    return true;
  } catch (error) {
    throw new Error();
  }
};

export const updatePost = async (post: iParsedRetrievedPost) => {
  const { data, error } = await supabaseAdmin
    .from("kinder-in-hh-blogposts")
    .update(post)
    .match({ id: post.id });
  if (error) {
    throw new Error(error.message);
  }
  return true;
};

export const getPostWithID = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from("kinder-in-hh-blogposts")
    .select("*")
    .match({ id });
  if (error) {
    throw new Error(error.message);
  }
  return data[0] as iStringifiedRetrievedPost;
};

export const getPostWithCategory = async (category: string) => {
  const { data, error } = await supabaseAdmin
    .from("kinder-in-hh-blogposts")
    .select("*");
  if (error) {
    throw new Error(error.message);
  }
  return (data as iStringifiedRetrievedPost[]).filter(({ categories }) =>
    categories.includes(category)
  );
};

export const getPostWithBezirk = async (bezirk: string) => {
  const { data, error } = await supabaseAdmin
    .from("kinder-in-hh-blogposts")
    .select("*")
    .in("bezirk", [bezirk]);
  if (error) {
    throw new Error(error.message);
  }
  return data as iStringifiedRetrievedPost[];
};

export const getAllPosts = async () => {
  const { data, error } = await supabaseAdmin
    .from("kinder-in-hh-blogposts")
    .select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data as iStringifiedRetrievedPost[];
};

export const getPinnedPosts = async () => {
  const { data, error } = await supabaseAdmin
    .from("kinder-in-hh-blogposts")
    .select("*")
    .match({ pinnedPost: true });
  if (error) {
    throw new Error(error.message);
  }
  return data as iStringifiedRetrievedPost[];
};

export const deletePost = async (id: number) => {
  const { data, error } = await supabaseAdmin
    .from("kinder-in-hh-blogposts")
    .delete()
    .match({ id });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getAllPostsIds = async () => {
  const { data, error } = await supabaseAdmin
    .from("kinder-in-hh-blogposts")
    .select("id");
  if (error) {
    throw new Error(error.message);
  }
  const ids = (data as { id: string }[]).map(({ id }) => id);
  return ids;
};
