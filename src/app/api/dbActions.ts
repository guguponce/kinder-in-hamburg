"use server";
import type {
  categoryName,
  iBezirk,
  iEventType,
  iFlohmarkt,
  iPost,
  iSessionUser,
  iStringifiedFlohmarkt,
} from "@app/utils/types";
import { createClient } from "@auth/server";
import { getServerUser, proofUser } from "@app/api/auth/supabaseAuth";
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

const supabaseAdmin = createClient();

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
  type: "post" | "flohmarkt" | "spielplatz" | "event",
  contributor: iSessionUser,
  id: number | string
) => {
  try {
    const contributorData = {
      flohmaerkteSubmitted: JSON.stringify(
        type === "flohmarkt" || type === "event" ? [id] : []
      ),
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
  type: "post" | "flohmarkt" | "spielplatz" | "event",
  user: iSessionUser,
  id: number
) => {
  const authorized = await proofUser();
  if (!authorized) return "Not authorized";
  try {
    const contributor = await getContributorData(user.email!);
    if (!contributor) {
      await addNewContributor(type, user, id);
      return;
    }
    if (type === "flohmarkt" || type === "event") {
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
    const user = await getServerUser();
    if (!user) {
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
    revalidatePost();
    return true;
  } catch (error) {
    throw new Error("There was a problem adding the post.");
  }
};

export const updateSuggestedPost = async (post: iPost) => {
  const authorized = await proofUser();
  if (!authorized) return "Not authorized";
  try {
    const { error } = await supabaseAdmin
      .from("kih-suggestions")
      .update(post)
      .match({ id: post.id });
    if (error) {
      throw new Error(error.message);
    }
    revalidatePost();

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
      .ilike("status", "approved")
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
  const authorized = await proofUser();
  if (!authorized) return "Not authorized";
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
    revalidatePost();
    return true;
  } catch (error) {
    throw new Error(
      "There was a problem updating the status of the post: " + id + "."
    );
  }
};

export const updatePostStatus = async <
  T extends "rejected" | "approved" | "pending" | "old",
>(
  id: number,
  oldStatus: T,
  newStatus: T,
  post?: iPost
) => {
  const authorized = await proofUser();
  if (!authorized) return "Not authorized";
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
      .ilike("status", "approved")
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
      .ilike("status", "approved")
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
      .ilike("status", "approved")
      .match({ user_id: user.email });
    if (error) {
      throw new Error("There was a problem getting your approved posts.");
    }
    return parseAllPosts(data);
  } catch (error) {
    return false;
  }
};

export const getEventsFromBezirkStadtteil = async (
  bezirk: iBezirk,
  stadtteile: string[],
  eventTable: string = "flohmaerkte"
) => {
  const combinedCondition = await createQueryCondition(bezirk, stadtteile);
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .select("*")
      .or(combinedCondition)
      .gte("date", new Date().getTime());
    if (error) {
      throw new Error("There was a problem getting events from nearby.");
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
      .ilike("status", "approved")
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
      .ilike("status", "approved")
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

export const checkIfPostExists = async (
  id: string,
  eventTable: "kih-approved-blogposts" | "kih-suggestions"
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .select("id")
      .match({ id })
      .single();
    if (error) {
      throw new Error("There was a problem checking if the event exists.");
    }
    return data.id;
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
  futureFlohmaerkte: boolean = true,
  eventTable: string = "flohmaerkte"
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .select("*")
      .gte("date", futureFlohmaerkte ? new Date().getTime() : 0);
    if (error) {
      throw new Error("There was a problem getting the event posts.");
    }
    const parsedEvents = parseAllFlohmaerkte(data);
    const serparatedByStatus = separateByStatus(parsedEvents);
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
      .ilike("status", "approved")
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
      .ilike("status", "approved")
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
    revalidatePost();
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
  const authorized = await proofUser();
  if (!authorized) return "Not authorized";
  try {
    const { data, error } = await supabaseAdmin
      .from("kih-approved-blogposts")
      .update(post)
      .match({ id: post.id });
    if (error) {
      throw new Error("There was a problem updating the post.");
    }
    revalidatePost();

    return data;
  } catch (error) {
    throw new Error("There was a problem updating the post.");
  }
};
export const setEventAsOld = async (
  id: number,
  eventTable: string = "flohmaerkte"
) => {
  try {
    const { error } = await supabaseAdmin
      .from(eventTable)
      .update({ status: "old" })
      .match({ id });
    if (error) {
      throw new Error("There was a problem setting the event as old.");
    }
    return true;
  } catch (error) {
    throw new Error("There was a problem setting the event as old.");
  }
};
export const setAllPreviousEventsAsOld = async (
  eventTable: "flohmaerkte" | "events" = "flohmaerkte"
) => {
  try {
    const { today } = getTodayNexMonday();
    const flohs = ((await getAllEventsFromType("laterne")) || []).filter(
      (f) => f.date < today && f.status === "approved"
    );
    if (!flohs || flohs.length === 0) return "No old events found.";

    const oldFlohs = await Promise.all(
      flohs.map((f) => setEventAsOld(f.id, eventTable))
    );
    return "All previous events set as old." + oldFlohs.length;
  } catch (error) {
    throw new Error("There was a problem setting events as old.");
  }
};

// FLOHMAERKTE
// GET
export const getSuggestedEvents = async (
  eventTable: string = "flohmaerkte"
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
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

export const getAllFutureEventsFromType = async (eventType: iEventType) => {
  const { today } = getTodayNexMonday();
  try {
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .ilike("type", eventType)
      .or(
        `date.gte.${today - 1000 * 60 * 60},and(date.lte.${today},endDate.gte.${today + 1000 * 60 * 60 * 12})`
      );
    if (error) {
      throw new Error("There was a problem getting the events.");
    }
    return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
  } catch (error) {
    return false;
  }
};

export const getFutureApprovedEventsFromType = async (
  eventType: iEventType,
  date?: number
) => {
  // Retrieves active Events (in the future or already started)
  const { today } = getTodayNexMonday();
  try {
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .ilike("type", eventType)
      .ilike("status", "approved")
      .or(
        `date.gte.${today - 1000 * 60 * 60},and(date.lte.${date || today},endDate.gte.${(date || today) + 1000 * 60 * 60 * 12})`
      );
    if (error) {
      throw new Error("There was a problem getting the events.");
    }
    return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
  } catch (error) {
    return false;
  }
};

export const checkIfEventOrFlohmarktExists = async (
  id: string,
  eventTable: string
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .select("id")
      .match({ id })
      .single();
    if (error) {
      throw new Error("There was a problem checking if the event exists.");
    }
    return data.id;
  } catch (error) {
    return false;
  }
};

export const getEventWithID = async (
  id: string,
  eventTable: string = "flohmaerkte"
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .select("*")
      .match({ id })
      .single();
    if (error) {
      console.log(error.message);
      return false;
    }
    return parseFlohmarkt(data as iStringifiedFlohmarkt);
  } catch (error) {
    console.log("Error getting event with id: ", id);
    return false;
  }
};

export const getEventMetadata = async (
  id: string,
  eventTable: string = "flohmaerkte"
) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from(eventTable)
      .select("title,bezirk,optionalComment,image,stadtteil")
      .match({ id })
      .single();
    if (error) {
      return false;
    }
    const { title, bezirk, optionalComment, image, stadtteil } =
      data as Partial<iFlohmarkt>;
    return { title, bezirk, optionalComment, image, stadtteil };
  } catch (error) {
    return false;
  }
};

export const getApprovedEventsAndFlohmaerkte = async () => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const { data: flohmaerkte, error: flohError } = await supabaseAdmin
      .from("flohmaerkte")
      .select("*")
      .ilike("status", "approved")
      .gte("date", today);
    const { data: events, error: eventError } = await supabaseAdmin
      .from("events")
      .select("*")
      .ilike("status", "approved")
      .gte("date", today);
    if (flohError || eventError) {
      throw new Error("There was a problem getting the events.");
    }
    return {
      flohmaerkte: flohmaerkte.map((f) => parseFlohmarkt(f)) as iFlohmarkt[],
      events: events.map((e) => parseFlohmarkt(e)) as iFlohmarkt[],
    };
  } catch (error) {
    return false;
  }
};

export const getApprovedEvents = async (eventTable: string = "flohmaerkte") => {
  const { today } = getTodayNexMonday();
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .select("*")
      .ilike("status", "approved")
      .gte("date", today - 1000 * 60 * 60);
    if (error) {
      throw new Error("There was a problem getting the events.");
    }
    return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
  } catch (error) {
    return false;
  }
};

export const getAllApprovedEvents = async (
  eventTable: string = "flohmaerkte"
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .select("*")
      .ilike("status", "approved");
    if (error) {
      throw new Error("There was a problem getting the events.");
    }
    return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
  } catch (error) {
    return false;
  }
};

export async function getAllEventsFromType(type: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .ilike("type", type);
    if (error) {
      throw new Error("There was a problem getting the events.");
    }
    return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
  } catch (error) {
    return false;
  }
}

export const getAllEventsThisWeek = async (
  eventTypes?: iEventType[],
  bezirk?: iBezirk,
  stadtteile?: string[]
) => {
  const { today, nextMonday } = getTodayNexMonday();
  const until =
    new Date().getDay() === 0
      ? nextMonday + 1000 * 60 * 60 * 24 * 7
      : nextMonday - 1000 * 60 * 60 * 2;
  let query = supabaseAdmin
    .from("events")
    .select("*")
    .or(
      `date.gte.${today - 1000 * 60 * 60},and(date.lte.${today},endDate.gte.${today + 1000 * 60 * 60 * 12})`
    )
    .lte("date", until)
    .ilike("status", "approved");

  try {
    if (bezirk || stadtteile || eventTypes) {
      if (bezirk && !checkBezirk(bezirk))
        throw new Error("Invalid Bezirk: " + bezirk);

      // Construct bezirk stadtteile condition
      const stadtteileConditions = stadtteile
        ? stadtteile?.map((nh) => `stadtteil.ilike.%${nh}%`).join(",")
        : "";
      const bezirkCondition = bezirk ? `bezirk.eq.${bezirk}` : "";
      const eventsTypesConditions = eventTypes
        ? eventTypes?.map((nh) => `type.ilike.%${nh}%`).join(",")
        : "";

      const combinedCondition = [
        eventsTypesConditions,
        stadtteileConditions,
        bezirkCondition,
      ]
        .filter(Boolean)
        .join(",");
      const { data, error } = await query.or(combinedCondition);

      if (error) {
        return false;
      }
      return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
    } else {
      const { data, error } = await query;
      if (error) {
        return false;
      }
      return data.map((f) => parseFlohmarkt(f)) as iFlohmarkt[];
    }
  } catch (error) {
    return false;
  }
};
export const getApprovedEventsWithBezirk = async (
  bezirk: iBezirk,
  eventTable: string = "flohmaerkte"
) => {
  const { today } = getTodayNexMonday();
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .select("*")
      .ilike("status", "approved")
      .gte("date", today)
      .ilike("bezirk", bezirk);
    if (error) {
      throw new Error("There was a problem getting the events.");
    }
    return parseAllFlohmaerkte(data);
  } catch (error) {
    return false;
  }
};

export const getUserEvents = async (
  email: string,
  eventTable: string = "flohmaerkte"
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .select("*")
      .ilike("addedBy", `%"email":"${email}"%`);

    if (error) {
      throw new Error("There was a problem getting your suggested events.");
    }
    const parsedEvents = parseAllFlohmaerkte(data);

    return separateByStatus(parsedEvents);
  } catch (error) {
    return false;
  }
};
export const getThisWeekEvents = async (eventTable: string = "flohmaerkte") => {
  const { today, nextMonday } = getTodayNexMonday();
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .select("*")
      .match({ status: "approved" })
      .gte("date", today - 1000 * 60 * 60)
      .lte("date", nextMonday - 1000 * 60 * 60 * 2);
    if (error) {
      return false;
    }
    return parseAllFlohmaerkte(data);
  } catch (error) {
    return false;
  }
};
// POST
export const addEvent = async (
  event: iFlohmarkt,
  eventTable: string = "flohmaerkte"
) => {
  try {
    const user = await getServerUser();
    if (!user?.email) {
      return "Not logged in";
    }
    let submittedEvent = {
      ...event,
      closedDates: event.closedDates?.length
        ? JSON.stringify(event.closedDates)
        : undefined,
      addedBy: JSON.stringify({
        name: user.name,
        email: user.email,
        image: user.avatar_url,
      }),
    };
    if (eventTable === "flohmaerkte") {
      delete submittedEvent.closedDates;
    }
    const { error } = await supabaseAdmin
      .from(eventTable)
      .insert(submittedEvent);
    if (error) {
      throw new Error("Error adding event: " + error.message);
    }
    return "Event added";
  } catch (error) {
    throw new Error("Error adding event" + (error as PostgrestError).message);
  }
};

// DELETE
export const deleteEvent = async (
  id: string,
  eventTable: string = "flohmaerkte"
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .delete()
      .match({ id });
    deletePreviousFlohmaerkteImages(parseInt(id));
    if (error) {
      throw new Error("Error deleting event");
    }
    return data;
  } catch (error) {
    throw new Error("Error deleting event");
  }
};
export const rejectEvent = async (
  id: string,
  eventTable: string = "flohmaerkte"
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .update({ status: "rejected" })
      .match({ id });
    if (error) {
      throw new Error("There was a problem rejecting the event.");
    }
    return true;
  } catch (error) {
    throw new Error("There was a problem rejecting the event.");
  }
};

// UPDATE
export const updateEvent = async (
  event: iFlohmarkt,
  eventTable: string = "flohmaerkte"
) => {
  const authorized = await proofUser();
  if (!authorized) return "Not authorized";
  const updatedEvent = {
    ...event,
    closedDates: event.closedDates?.length
      ? JSON.stringify(event.closedDates)
      : undefined,
  };
  if (eventTable === "flohmaerkte") {
    delete updatedEvent.closedDates;
  }
  try {
    const { error } = await supabaseAdmin
      .from(eventTable)
      .update(updatedEvent)
      .match({ id: event.id });

    if (error) {
      console.log(error.message);
      throw new Error("Error updating event");
    }
    return "Updated";
  } catch (error) {
    throw new Error("Error updating event");
  }
};

export const approveSuggestedEvent = async (
  id: string,
  eventTable: string = "flohmaerkte"
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .update({ status: "approved" })
      .match({ id });
    if (error) {
      throw new Error("There was a problem approving the event.");
    }
    return true;
  } catch (error) {
    throw new Error("There was a problem approving the event.");
  }
};

export const updateEventStatus = async (
  id: number | string,
  status: string,
  eventTable: string = "flohmaerkte"
) => {
  const authorized = await proofUser();
  if (!authorized) return "Not authorized";
  try {
    const { error } = await supabaseAdmin
      .from(eventTable)
      .update({ status })
      .match({ id });
    if (error) {
      throw new Error("There was a problem updating the event.");
    }
    console.log("Event updated", status);
    return true;
  } catch (error) {
    throw new Error("There was a problem updating the event.");
  }
};

export const clearLatLonFromEvent = async (
  id: string,
  eventTable: string = "flohmaerkte"
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(eventTable)
      .update({ lat: null, lon: null })
      .match({ id });
    if (error) {
      throw new Error("There was a problem updating the event.");
    }
    await revalidateFlohmarkt();
    return true;
  } catch (error) {
    throw new Error("There was a problem updating the event.");
  }
};

export const getAllEventsIds = async (eventTable: string = "flohmaerkte") => {
  try {
    const { data, error } = await supabaseAdmin.from(eventTable).select("id");
    if (error) {
      throw new Error("Error getting events IDs from a db");
    }
    return data.map((d) => d.id);
  } catch (error) {
    return false;
  }
};
