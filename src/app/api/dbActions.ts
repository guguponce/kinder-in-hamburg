"use server";
import type {
  categoryName,
  iBezirk,
  iContributor,
  iFlohmarkt,
  iPost,
  iSessionUser,
} from "@app/utils/types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import {
  checkBezirk,
  checkCategory,
  parseAllFlohmarkte,
  parseAllPosts,
  parseFlohmarkt,
  parsePost,
} from "@app/utils/functions";
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

// CONTRIBUTORS
export const getContributorData = async (email: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("contributors")
      .select("*")
      .match({ id: email });
    if (error) {
      throw new Error("There was a problem getting the contributor data.");
    }
    return data[0] as iContributor;
  } catch (error) {
    return false;
  }
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
      throw new Error("There was a problem adding the contributor.");
    }
  } catch (error) {
    throw new Error("There was a problem adding the contributor.");
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
      throw new Error(
        "There was a problem updating the contributor's postSubmitted."
      );
    }
  } catch (error) {
    throw new Error("There was a problem updating the contributor.");
  }
};

export const deleteContributor = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("contributors")
      .delete()
      .match({ id });
    if (error) {
      throw new Error("There was a problem deleting the contributor.");
    }
    return data;
  } catch (error) {
    throw new Error("There was a problem deleting the contributor.");
  }
};

// SUGGESTED BLOGPOSTS
export const addNewSuggestedPost = async (post: iPost) => {
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

    const { error } = await supabaseAdmin
      .from("kih-suggestions")
      .insert(submittedPost)
      .select();
    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    throw new Error("There was a problem adding the post.");
  }
};

export const updateSuggestedPost = async (post: iPost) => {
  try {
    const { error } = await supabaseAdmin
      .from("kih-suggestions")
      .update(post)
      .match({ id: post.id });
    if (error) {
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    throw new Error("There was a problem updating the post.");
  }
};

export const getSuggestedPostWithID = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-suggestions")
      .select("*")
      .match({ id });
    if (error) {
      throw new Error("The post with the id " + id + " was not found.");
    }
    return parsePost(data[0]);
  } catch (error) {
    return false;
  }
};

export const getAllSuggestedPosts = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-suggestions")
      .select("*");
    if (error) {
      throw new Error("There was a problem getting the suggested posts.");
    }
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const getSuggestionsWithCat = async (category: string) => {
  try {
    if (!checkCategory(category))
      throw new Error("Invalid Category: " + category);
    const { data, error } = await supabaseAdmin
      .from("kih-suggestions")
      .select()
      .ilike("categories", `%${category}%`);
    if (error) {
      throw new Error(
        "There was a problem getting the posts for this category."
      );
    }
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const getSuggestionsWithCatAndBezirk = async (
  category: categoryName,
  bezirk: iBezirk
) => {
  if (!checkCategory(category))
    throw new Error("Invalid Category: " + category);
  if (!checkBezirk(bezirk)) throw new Error("Invalid Bezirk: " + bezirk);

  try {
    const { data, error } = await supabaseAdmin
      .from("kih-suggestions")
      .select()
      .ilike("categories", `%${category}%`)
      .like("bezirk", bezirk);
    if (error) {
      throw new Error(
        "There was a problem getting the posts for this Category and Bezirk."
      );
    }
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const getSuggestionsWithBezirk = async (bezirk: iBezirk) => {
  if (!checkBezirk(bezirk)) throw new Error("Invalid Bezirk: " + bezirk);
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-suggestions")
      .select("*")
      .in("bezirk", [bezirk]);
    if (error) {
      throw new Error("There was a problem getting the posts for this Bezirk.");
    }
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const deleteSuggestion = async (id: number) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-suggestions")
      .delete()
      .match({ id });
    if (error) {
      throw new Error("There was a problem deleting the post: " + id + ".");
    }
    return true;
  } catch (error) {
    throw new Error("There was a problem deleting the post: " + id + ".");
  }
};

export const getUsersSuggestions = async (email: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-suggestions")
      .select("*")
      .match({ user_id: email });
    if (error) {
      throw new Error("There was a problem getting your suggestions.");
    }
    const parsedPosts = parseAllPosts(data);

    return parsedPosts.reduce(
      (acc, current) => {
        const { status } = current;
        if (!status) {
          acc["approved"].push(current);
        } else {
          acc[status].push(current);
        }
        return acc;
      },
      {
        approved: [] as iPost[],
        pending: [] as iPost[],
        rejected: [] as iPost[],
      }
    );
  } catch (error) {
    return false;
  }
};

export const updateSuggestionStatus = async (id: number, status: string) => {
  try {
    const { error } = await supabaseAdmin
      .from("kih-suggestions")
      .update({ status })
      .match({ id });
    if (error) {
      throw new Error(
        "There was a problem updating the status of the post: " + id + "."
      );
    }
    return true;
  } catch (error) {
    throw new Error(
      "There was a problem updating the status of the post: " + id + "."
    );
  }
};

// APPROVED BLOGPOSTS
export const getApprovedPostWithCat = async (category: string) => {
  if (!checkCategory(category))
    throw new Error("Invalid Category: " + category);
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .select()
      .ilike("categories", `%${category}%`);
    if (error) {
      throw new Error(
        "There was a problem getting the posts for this category."
      );
    }
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const getUserApprovedPosts = async (user: iSessionUser) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .select("*")
      .match({ user_id: user.email });
    if (error) {
      throw new Error("There was a problem getting your approved posts.");
    }
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const getPostWithBezirk = async (bezirk: iBezirk) => {
  if (!checkBezirk(bezirk)) throw new Error("Invalid Bezirk: " + bezirk);

  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .select("*")
      .in("bezirk", [bezirk]);
    if (error) {
      throw new Error("There was a problem getting the posts for this Bezirk.");
    }
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const getAllApprovedPosts = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .select("*");
    if (error) {
      throw new Error("There was a problem getting the approved posts.");
    }
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const getPinnedPosts = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .select("*")
      .match({ pinnedPost: true });
    if (error) {
      throw new Error("There was a problem getting the pinned posts.");
    }
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const getApprovedPostWithID = async (id: string) => {
  try {
    const res = await supabaseAdmin
      .from("kih-approved-blogposts")
      .select("*")
      .match({ id });
    if (res.error) {
      console.log("asdfasdfafdasfasfd", res);
      throw new Error("The post with the id " + id + " was not found.");
    }
    return parsePost(res.data[0]);
  } catch (error) {
    return false;
  }
};

export const deleteApprovedPost = async (id: number) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .delete()
      .match({ id });
    await updateSuggestionStatus(id, "rejected");
    if (error) {
      throw new Error("There was a problem deleting the post: " + id + ".");
    }
    return data;
  } catch (error) {
    throw new Error("There was a problem deleting the post: " + id + ".");
  }
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
      throw new Error("Error getting posts IDs from a db");
    }
    return data.map((d) => d.data!.map((d) => d.id)).flat();
  } catch (error) {
    return false;
  }
};

export const approveSuggestedPost = async (post: iPost) => {
  try {
    const { error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .insert(post);
    const updatedStatus = await updateSuggestionStatus(post.id, "approved");
    if (error) {
      throw new Error("There was a problem approving the post.");
    }
    console.log("approved");
    return true;
  } catch (error) {
    throw new Error("There was a problem approving the post.");
  }
};

export const updateApprovedPost = async (post: iPost) => {
  try {
    const { error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .update(post)
      .match({ id: post.id });
    if (error) {
      throw new Error("There was a problem updating the post.");
    }
    return true;
  } catch (error) {
    throw new Error("There was a problem updating the post.");
  }
};

// FLOHMAERKTE
// GET
export const getSuggestedFlohmaerkte = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .ilike("status", "pending");
    if (error) {
      return false;
    }
    return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
  } catch (error) {
    return false;
  }
};
export const getFlohmarktWithID = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .match({ id });
    if (error) {
      return false;
    }

    return parseFlohmarkt(data[0]);
  } catch (error) {
    return false;
  }
};

export const getApprovedFlohmaerkte = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .ilike("status", "approved");
    if (error) {
      throw new Error("There was a problem getting the Flea Markets.");
    }
    return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
  } catch (error) {
    return false;
  }
};

export const getFutureApprovedFlohmaerkte = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .ilike("status", "approved")
      .gte("date", new Date().getTime());
    if (error) {
      throw new Error("There was a problem getting the future Flea Markets.");
    }
    return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
  } catch (error) {
    return false;
  }
};

export const getUserFlohmaerkte = async (email: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .ilike("addedBy", `%"email":"${email}"%`);

    if (error) {
      throw new Error(
        "There was a problem getting your suggested Flea Markets."
      );
    }
    const parsedFlohmaerkte = parseAllFlohmarkte(data);
    return parsedFlohmaerkte.reduce(
      (acc, current) => {
        const { status } = current;
        if (!status) {
          acc["approved"].push(current);
        } else {
          acc[status].push(current);
        }
        return acc;
      },
      {
        approved: [] as iFlohmarkt[],
        pending: [] as iFlohmarkt[],
        rejected: [] as iFlohmarkt[],
      }
    );
  } catch (error) {
    return false;
  }
};

// POST
export const addFlohmarkt = async (flohmarkt: iFlohmarkt) => {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return "Not logged in";
    }
    const submittedFlohmarkt = {
      ...flohmarkt,
      addedBy: JSON.stringify(session.user),
    };
    const { error } = await supabaseAdmin
      .from("flohmaerkte")
      .insert(submittedFlohmarkt);
    if (error) {
      throw new Error("Error adding flohmarkt");
    }
    return "Flohmarkt added";
  } catch (error) {
    throw new Error("Error adding flohmarkt");
  }
};

// DELETE
export const deleteFlohmarkt = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .delete()
      .match({ id });
    if (error) {
      throw new Error("Error deleting flohmarkt");
    }
    return data;
  } catch (error) {
    throw new Error("Error deleting flohmarkt");
  }
};
export const rejectFlohmarkt = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .update({ status: "rejected" })
      .match({ id });
    if (error) {
      throw new Error("There was a problem rejecting the Flea Market.");
    }
    return true;
  } catch (error) {
    throw new Error("There was a problem rejecting the Flea Market.");
  }
};

// UPDATE
export const updateFlohmarkt = async (flohmarkt: iFlohmarkt) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .update(flohmarkt)
      .match({ id: flohmarkt.id });
    if (error) {
      throw new Error("Error updating flohmarkt");
    }
    return data;
  } catch (error) {
    throw new Error("Error updating flohmarkt");
  }
};

export const approveSuggestedFlohmarkt = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .update({ status: "approved" })
      .match({ id });
    if (error) {
      throw new Error("There was a problem approving the Flea Market.");
    }
    return true;
  } catch (error) {
    throw new Error("There was a problem approving the Flea Market.");
  }
};

export const getAllFlohmaerkteIds = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("id");
    if (error) {
      throw new Error("Error getting posts IDs from a db");
    }
    return data.map((d) => d.id);
  } catch (error) {
    return false;
  }
};
