"use server";
import type {
  categoryName,
  iBezirk,
  iFlohmarkt,
  iPost,
  iSessionUser,
} from "@app/utils/types";
import { createClient } from "@auth/server";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import {
  checkBezirk,
  getTodayNexMonday,
  checkCategory,
  parseAllFlohmaerkte,
  parseAllPosts,
  parseFlohmarkt,
  parsePost,
  parseContributor,
  separateByStatus,
} from "@app/utils/functions";
import { deletePreviousFlohmaerkteImages } from "./storageActions";
import {
  revalidateFlohmarkt,
  revalidatePost,
} from "@app/utils/actions/revalidate";
import { PostgrestError } from "@supabase/supabase-js";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const supabaseAdmin = createClient();

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
    return parseContributor(data[0]);
  } catch (error) {
    return false;
  }
};

export const addNewContributor = async (
  type: "post" | "flohmarkt" | "spielplatz",
  contributor: iSessionUser,
  id: number | string
) => {
  try {
    const contributorData = {
      flohmaerkteSubmitted: JSON.stringify(type === "flohmarkt" ? [id] : []),
      spielplaetzeSubmitted: JSON.stringify(type === "spielplatz" ? [id] : []),
      name: contributor.name,
      image: contributor.image,
      id: contributor.email,
      email: contributor.email,
      postsSubmitted: JSON.stringify(type === "post" ? [id] : []),
    };
    const { error } = await supabaseAdmin
      .from("contributors")
      .insert(contributorData);
    if (error) {
      throw new Error("There was a problem adding the contributor.");
    }
  } catch (error) {
    throw new Error("There was a problem adding the contributor.");
  }
};

export const updateContributor = async (
  type: "post" | "flohmarkt" | "spielplatz",
  user: iSessionUser,
  id: number
) => {
  try {
    const contributor = await getContributorData(user.email!);
    if (!contributor) {
      await addNewContributor(type, user, id);
      return;
    }
    if (type === "flohmarkt") {
      if (contributor.flohmaerkteSubmitted?.includes(id)) return;
      const { error } = await supabaseAdmin
        .from("contributors")
        .update({
          flohmaerkteSubmitted: [
            ...(contributor.flohmaerkteSubmitted || []),
            id,
          ],
        })
        .match({ id: contributor.id });
      if (error) {
        throw new Error(
          "There was a problem updating the contributor's flohmarktSubmitted."
        );
      }
    } else if (type === "post") {
      if (contributor.postsSubmitted?.includes(id)) return;
      const { error } = await supabaseAdmin
        .from("contributors")
        .update({
          postsSubmitted: [...(contributor.postsSubmitted || []), id],
        })
        .match({ id: contributor.id });
      if (error) {
        throw new Error(
          "There was a problem updating the contributor's postSubmitted."
        );
      }
    } else if (type === "spielplatz") {
      if (contributor.spielplaetzeSubmitted?.includes(id)) return;
      const { error } = await supabaseAdmin
        .from("contributors")
        .update({
          spielplaetzeSubmitted: [
            ...(contributor.spielplaetzeSubmitted || []),
            id,
          ],
        })
        .match({ id: contributor.id });
      if (error) {
        throw new Error(
          "There was a problem updating the contributor's spielplatzSubmitted."
        );
      }
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
    const session = await getServerUser();
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

export const getPendingPosts = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-suggestions")
      .select("*")
      .ilike("status", "pending");
    if (error) {
      throw new Error("There was a problem getting the pending posts.");
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

export const getApprovedPostsWithCatAndBezirk = async (
  category: categoryName,
  bezirk: iBezirk
) => {
  if (!checkCategory(category))
    throw new Error("Invalid Category: " + category);
  if (!checkBezirk(bezirk)) throw new Error("Invalid Bezirk: " + bezirk);

  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
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
          acc[status as "approved" | "pending" | "rejected"].push(current);
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

export const updatePostStatus = async <
  T extends "rejected" | "approved" | "pending" | "old"
>(
  id: number,
  oldStatus: T,
  newStatus: T,
  post?: iPost
) => {
  if (oldStatus === "approved") {
    if (newStatus === "rejected" || newStatus === "pending") {
      await deleteApprovedPost(id, newStatus);
    }
  } else {
    if (newStatus === "approved" && post) {
      await approveSuggestedPost(post);
    } else {
      await updateSuggestionStatus(id, newStatus);
    }
    revalidatePost();
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

export const getSuggestedPostWithCat = async (category: string) => {
  if (!checkCategory(category))
    throw new Error("Invalid Category: " + category);
  try {
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

export const getPostsByCategoryBezirkStadtteile = async (
  bezirk: iBezirk,
  stadtteile: string[]
) => {
  if (!checkBezirk(bezirk)) throw new Error("Invalid Bezirk: " + bezirk);

  // Construct bezirk stadtteile condition
  const stadtteileConditions = stadtteile
    .map((nh) => `stadtteil.ilike.%${nh}%`)
    .join(",");
  const bezirkCondition = `bezirk.eq.${bezirk}`;
  const combinedCondition = `${stadtteileConditions},${bezirkCondition}`;
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .select("*")
      .or(combinedCondition);
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

export const getFlohmaerkteFromBezirkStadtteil = async (
  bezirk: iBezirk,
  stadtteile: string[]
) => {
  const combinedCondition = await createQueryCondition(bezirk, stadtteile);
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .or(combinedCondition)
      .gte("date", new Date().getTime());
    if (error) {
      throw new Error("There was a problem getting flea markets from nearby.");
    }
    return data.map((floh) => parseFlohmarkt(floh));
  } catch (error) {
    return false;
  }
};
export const createQueryCondition = async (
  bezirk: iBezirk,
  stadtteile: string[] | undefined
) => {
  if (!checkBezirk(bezirk)) throw new Error("Invalid Bezirk: " + bezirk);

  // Construct bezirk stadtteile condition
  const stadtteileConditions =
    stadtteile && stadtteile.map((nh) => `stadtteil.ilike.%${nh}%`).join(",");
  const bezirkCondition = `bezirk.eq.${bezirk}`;
  if (!stadtteileConditions) return bezirkCondition;
  return `${stadtteileConditions},${bezirkCondition}`;
};

export const getPostsFromBezirkStadtteile = async (
  bezirk: iBezirk,
  stadtteile: string[] | undefined
) => {
  const combinedCondition = await createQueryCondition(bezirk, stadtteile);
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .select("*")
      .or(combinedCondition);
    if (error) {
      throw new Error("There was a problem getting posts from nearby.");
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

export const getPinnedPostsWithFilter = async (
  filter: "category" | "bezirk",
  value: string
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .select("*")
      .match({ pinnedPost: true })
      .ilike(filter, value);
    if (error) {
      throw new Error("There was a problem getting the pinned posts.");
    }
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const getAllFlohmaerteSeparatedByStatus = async (
  futureFlohmarkte: boolean = true
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .gte("date", futureFlohmarkte ? new Date().getTime() : 0);
    if (error) {
      throw new Error("There was a problem getting the approved posts.");
    }
    const parsedFlohmaerkte = parseAllFlohmaerkte(data);
    const serparatedByStatus = separateByStatus(parsedFlohmaerkte);
    return serparatedByStatus;
  } catch (error) {
    return false;
  }
};
export const getAllPostsSeparatedByStatus = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-suggestions")
      .select("*");
    if (error) {
      throw new Error("There was a problem getting the approved posts.");
    }

    const parsedPosts = parseAllPosts(data);
    const separatedByStatus = separateByStatus(parsedPosts);
    return separatedByStatus;
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
      throw new Error("The post with the id " + id + " was not found.");
    }
    return parsePost(res.data[0]);
  } catch (error) {
    return false;
  }
};

export const deleteApprovedPost = async (
  id: number,
  newStatus: "pending" | "rejected" = "rejected"
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .delete()
      .match({ id });
    await updateSuggestionStatus(id, newStatus);
    if (error) {
      throw new Error("There was a problem deleting the post: " + id + ".");
    }
    return data;
  } catch (error) {
    throw new Error("There was a problem deleting the post: " + id + ".");
  }
};

export const getAllNearPosts = async (
  stadtteil: string | undefined,
  bezirk: iBezirk
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .select("*")
      .ilike(stadtteil ? "stadtteil" : "bezirk", stadtteil || bezirk)
      .like("bezirk", bezirk);
    if (error) {
      throw new Error("There was a problem getting the addresses.");
    }
    if (!data) return false;
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const getAllPostsIds = async (id?: string) => {
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
    const ids = [...data.map((d) => d.data!.map((d) => d.id)).flat()];
    return id ? [...ids, id] : ids;
  } catch (error) {
    return false;
  }
};

export const approveSuggestedPost = async (post: iPost) => {
  try {
    const { error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .insert(post);
    await updateSuggestionStatus(post.id, "approved");
    if (error) {
      throw new Error("There was a problem approving the post.");
    }
    return true;
  } catch (error) {
    throw new Error("There was a problem approving the post.");
  }
};

export const rejectSuggestedPost = async (id: number) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .delete()
      .match({ id });
    if (error) {
      throw new Error("There was a problem rejecting the post.");
    }

    const { error: error2 } = await supabaseAdmin
      .from("kih-suggestions")
      .update({ status: "rejected" })
      .match({ id });

    return data;
  } catch (error) {
    throw new Error("There was a problem rejecting the post.");
  }
};

export const restorePost = async (id: string | number) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .delete()
      .match({ id });

    if (error) {
      throw new Error("There was a problem restoring the post.");
    }
    const { error: error2 } = await supabaseAdmin
      .from("kih-suggestions")
      .update({ status: "pending" })
      .match({ id });
    return data;
  } catch (error) {
    throw new Error("There was a problem restoring the post.");
  }
};

export const clearLatLonFromPost = async (id: string | number) => {
  try {
    const { error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .update({ lat: null, lon: null })
      .match({ id });

    const { error: error2 } = await supabaseAdmin
      .from("kih-suggestions")
      .update({ lat: null, lon: null })
      .match({ id });
    if (error || error2) {
      throw new Error("There was a problem clearing the lat and lon.");
    }
    await revalidatePost();

    return true;
  } catch (error) {
    throw new Error("There was a problem clearing the lat and lon.");
  }
};

export const updateApprovedPost = async (post: iPost) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .update(post)
      .match({ id: post.id });
    if (error) {
      throw new Error("There was a problem updating the post.");
    }
    return data;
  } catch (error) {
    throw new Error("There was a problem updating the post.");
  }
};
export const setFlohmarktAsOld = async (id: number) => {
  try {
    const { error } = await supabaseAdmin
      .from("flohmaerkte")
      .update({ status: "old" })
      .match({ id });
    if (error) {
      throw new Error("There was a problem setting the Flea Market as old.");
    }
    return true;
  } catch (error) {
    throw new Error("There was a problem setting the Flea Market as old.");
  }
};
export const setAllPreviousFlohmaerkteAsOld = async () => {
  try {
    const { today } = getTodayNexMonday();
    const flohs = ((await getAllApprovedFlohmaerkte()) || []).filter(
      (f) => f.date < today && f.status === "approved"
    );
    if (!flohs || flohs.length === 0) return false;

    const oldFlohs = await Promise.all(
      flohs.map((f) => setFlohmarktAsOld(f.id))
    );
    return oldFlohs;
  } catch (error) {
    throw new Error("There was a problem setting the Flea Market as old.");
  }
};

// FLOHMAERKTE
// GET
export const getSuggestedFlohmaerkte = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .neq("status", "approved");
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

export const getFlohmarktMetadata = async (
  id: string,
  cookies?: ReadonlyRequestCookies
) => {
  const supabase = createClient(cookies);
  try {
    const { data, error } = await supabase
      .from("flohmaerkte")
      .select("title,bezirk,optionalComment")
      .match({ id })
      .single();
    if (error) {
      return false;
    }
    const { title, bezirk, optionalComment } = data as {
      title: string;
      bezirk: iBezirk;
      optionalComment: string;
    };
    return { title, bezirk, optionalComment };
  } catch (error) {
    return false;
  }
};

export const getAllFlohmaerkte = async () => {
  try {
    const { data, error } = await supabaseAdmin.from("flohmaerkte").select("*");
    if (error) {
      throw new Error("There was a problem getting the Flea Markets.");
    }
    return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
  } catch (error) {
    return false;
  }
};

export const getApprovedFlohmaerkte = async () => {
  const { today } = getTodayNexMonday();
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .ilike("status", "approved")
      .gte("date", today - 1000 * 60 * 60);
    if (error) {
      throw new Error("There was a problem getting the Flea Markets.");
    }
    return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
  } catch (error) {
    return false;
  }
};

export const getAllApprovedFlohmaerkte = async () => {
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

export const getApprovedFlohmaerkteWithBezirk = async (bezirk: iBezirk) => {
  const { today } = getTodayNexMonday();
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .ilike("status", "approved")
      .gte("date", today)
      .ilike("bezirk", bezirk);
    if (error) {
      throw new Error("There was a problem getting the Flea Markets.");
    }
    return parseAllFlohmaerkte(data);
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
    const parsedFlohmaerkte = parseAllFlohmaerkte(data);

    return separateByStatus(parsedFlohmaerkte);
  } catch (error) {
    return false;
  }
};
export const getThisWeekFlohmaerkte = async () => {
  const { today, nextMonday } = getTodayNexMonday();
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .match({ status: "approved" })
      .gte("date", today - 1000 * 60 * 60)
      .lte("date", nextMonday);
    if (error) {
      return false;
    }
    return parseAllFlohmaerkte(data);
  } catch (error) {
    return false;
  }
};
// POST
export const addFlohmarkt = async (flohmarkt: iFlohmarkt) => {
  try {
    const session = await getServerUser();
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
      throw new Error("Error adding flohmarkt: " + error.message);
    }
    return "Flohmarkt added";
  } catch (error) {
    throw new Error(
      "Error adding flohmarkt" + (error as PostgrestError).message
    );
  }
};

// DELETE
export const deleteFlohmarkt = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .delete()
      .match({ id });
    deletePreviousFlohmaerkteImages(parseInt(id));
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

export const updateFlohmarktStatus = async (
  id: number | string,
  status: string
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .update({ status })
      .match({ id });
    if (error) {
      throw new Error("There was a problem updating the Flea Market.");
    }
    return true;
  } catch (error) {
    throw new Error("There was a problem updating the Flea Market.");
  }
};

export const clearLatLonFromFlohmarkt = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("flohmaerkte")
      .update({ lat: null, lon: null })
      .match({ id });
    if (error) {
      throw new Error("There was a problem updating the Flea Market.");
    }
    await revalidateFlohmarkt();
    return true;
  } catch (error) {
    throw new Error("There was a problem updating the Flea Market.");
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
