"use server";
import type {
  iBezirk,
  iSpielplatz,
  iStringifiedSpielplatz,
  iSessionUser,
} from "@app/utils/types";
import { getServerUser, proofUser } from "@app/api/auth/supabaseAuth";
import { checkBezirk, parseSpielplatz } from "@app/utils/functions";
import { revalidatePath } from "next/cache";
import { iSPType } from "@app/utils/types";
import { createClient } from "@auth/server";

export async function revalidateSpielplatz() {
  revalidatePath("/");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/posts", "layout");
  revalidatePath("/flohmaerkte", "layout");
  revalidatePath("/spielplaetze", "layout");
  revalidatePath("/update-spielplatz/", "layout");
  revalidatePath("/update-suggestion/", "layout");
}

const supabaseAdmin = createClient();

const parseAllSpielplaetze = (spielplaetze: iStringifiedSpielplatz[]) =>
  spielplaetze.map((f) => parseSpielplatz(f));

// GET

export const getAllSpielplaetze = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .select("*")
      .order("createdAt", { ascending: false });
    if (error) {
      throw new Error("There was a problem getting the Flea Markets.");
    }
    return data.map((f) => parseSpielplatz(f)) as iSpielplatz[];
  } catch (error) {
    return false;
  }
};

export const getApprovedSpielplaetze = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .select("*")
      .ilike("status", "approved");
    if (error) {
      throw new Error("There was a problem getting the Flea Markets.");
    }
    return data.map((f) => parseSpielplatz(f)) as iSpielplatz[];
  } catch (error) {
    return false;
  }
};

export const getTypeSpielplaetze = async (type: iSPType) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .select("*")
      .ilike("type", `%${type}%`);
    if (error) {
      throw new Error(
        "There was a problem getting the posts for this Category and Bezirk."
      );
    }
    return data.map((sp) => parseSpielplatz(sp));
  } catch (error) {
    return false;
  }
};

export const getSpielplatzFromBezirkStadtteil = async (
  bezirk: iBezirk,
  stadtteile: string[] | undefined
) => {
  if (!checkBezirk(bezirk)) throw new Error("Invalid Bezirk: " + bezirk);

  // Construct bezirk stadtteile condition
  const stadtteileConditions =
    stadtteile && stadtteile.map((nh) => `stadtteil.ilike.%${nh}%`).join(",");
  const bezirkCondition = `bezirk.eq.${bezirk}`;
  const combinedCondition = !!stadtteileConditions
    ? `${stadtteileConditions},${bezirkCondition}`
    : bezirkCondition;
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .select("*")
      .neq("status", "rejected")
      .or(combinedCondition);
    if (error) {
      throw new Error("There was a problem getting spielplätze from nearby.");
    }
    return data.map((sp) => parseSpielplatz(sp));
  } catch (error) {
    return false;
  }
};

export const getSuggestedSpielplaetze = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .select("*");
    if (error) {
      return false;
    }
    return data.map((f) => parseSpielplatz(f)) as iSpielplatz[];
  } catch (error) {
    return false;
  }
};
export const getSpielplatzWithID = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .select("*")
      .match({ id });
    if (error) {
      return false;
    }
    return parseSpielplatz(data[0]);
  } catch (error) {
    return false;
  }
};

export const getSpielplaetzeFromBezirk = async (bezirk: iBezirk) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .select("*")
      .neq("status", "rejected")
      .ilike("bezirk", bezirk);
    if (error) {
      throw new Error("There was a problem getting the posts for this Bezirk.");
    }
    return data.map((sp) => parseSpielplatz(sp));
  } catch (error) {
    return false;
  }
};

export const getSpielplaetzeFromStadtteile = async (stadtteile: string[]) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .select("*")
      .neq("status", "rejected")
      .in("stadtteil", stadtteile);
    if (error) {
      throw new Error(
        "There was a problem getting the posts for this Stadtteil."
      );
    }
    return data.map((sp) => parseSpielplatz(sp));
  } catch (error) {
    return false;
  }
};

export const getSpielplatzMetadata = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .select("title,bezirk,text")
      .match({ id });
    if (error) {
      return false;
    }
    const { title, bezirk, text } = data[0] as {
      title: string;
      bezirk: iBezirk;
      text: string;
    };
    return { title, bezirk, text };
  } catch (error) {
    return false;
  }
};

export const getApprovedSpielplaetzeWithBezirk = async (bezirk: iBezirk) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .select("*")
      .ilike("status", "approved")
      .ilike("bezirk", bezirk);
    if (error) {
      throw new Error("There was a problem getting the Flea Markets.");
    }
    return parseAllSpielplaetze(data);
  } catch (error) {
    return false;
  }
};

//   export const getUserSpielplaetze = async (email: string) => {
//     try {
//       const { data, error } = await supabaseAdmin
//         .from("spielplaetze")
//         .select("*")
//         .ilike("addedBy", `%"email":"${email}"%`);

//       if (error) {
//         throw new Error(
//           "There was a problem getting your suggested Flea Markets."
//         );
//       }
//       const parsedSpielplaetze = parseAllSpielplaetze(data);

//       return separateByStatus(parsedSpielplaetze);
//     } catch (error) {
//       return false;
//     }
//   };

// POST
export const addSpielplatz = async (spielplatz: iSpielplatz) => {
  try {
    const user = await getServerUser();
    if (!user) {
      return "Not logged in";
    }
    const addedBy = spielplatz.addedBy
      ? {
          ...spielplatz.addedBy,
          image: spielplatz.addedBy.image || user.picture,
        }
      : { name: user.full_name, email: user.email, image: user.picture };
    const submittedSpielplatz = {
      ...spielplatz,
      type: JSON.stringify(spielplatz.type),
      tags: spielplatz.tags ? JSON.stringify(spielplatz.tags) : null,
      spielgeraete: JSON.stringify(spielplatz.spielgeraete),
      ausruestung: spielplatz.ausruestung
        ? JSON.stringify(spielplatz.ausruestung)
        : null,
      image: spielplatz.image ? JSON.stringify(spielplatz.image) : null,
      address: JSON.stringify(spielplatz.address),
      addedBy: addedBy,
    };
    const { error } = await supabaseAdmin
      .from("spielplaetze")
      .insert(submittedSpielplatz);
    if (error) {
      throw new Error("Error adding spielplatz");
    }
    await revalidateSpielplatz();
    return "Spielplatz added";
  } catch (error) {
    throw new Error("Error adding spielplatz");
  }
};

// DELETE
export const deleteSpielplatz = async (id: string | number) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .delete()
      .match({ id });
    // deletePreviousSpielplaetzeImages(parseInt(id));
    if (error) {
      throw new Error("Error deleting spielplatz");
    }
    await revalidateSpielplatz();

    return data;
  } catch (error) {
    throw new Error("Error deleting spielplatz");
  }
};
export const rejectSpielplatz = async (id: string | number) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .update({ status: "rejected" })
      .match({ id });
    if (error) {
      throw new Error("There was a problem rejecting the Flea Market.");
    }
    await revalidateSpielplatz();
    return true;
  } catch (error) {
    throw new Error("There was a problem rejecting the Flea Market.");
  }
};

// UPDATE
export const updateSpielplatz = async (spielplatz: iSpielplatz) => {
  const authorized = await proofUser();
  if (!authorized) return "Not authorized";
  try {
    const submittedSpielplatz = {
      ...spielplatz,
      type: JSON.stringify(spielplatz.type),
      tags: spielplatz.tags ? JSON.stringify(spielplatz.tags) : null,
      spielgeraete: JSON.stringify(spielplatz.spielgeraete),
      ausruestung: spielplatz.ausruestung
        ? JSON.stringify(spielplatz.ausruestung)
        : null,
      image: spielplatz.image ? JSON.stringify(spielplatz.image) : null,
      address: JSON.stringify(spielplatz.address),
      addedBy: JSON.stringify(spielplatz.addedBy),
    };
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .update(submittedSpielplatz)
      .match({ id: spielplatz.id });
    if (error) {
      throw new Error("Error updating spielplatz");
    }
    await revalidateSpielplatz();
    return data;
  } catch (error) {
    throw new Error("Error updating spielplatz");
  }
};

export const clearLatLonFromSpielplatz = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .update({ lat: null, lon: null })
      .match({ id });
    if (error) {
      throw new Error("Error clearing lat lon from spielplatz");
    }
    await revalidateSpielplatz();
    return data;
  } catch (error) {
    throw new Error("Error clearing lat lon from spielplatz");
  }
};

export const approveSuggestedSpielplatz = async (id: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .update({ status: "approved" })
      .match({ id });
    if (error) {
      throw new Error("There was a problem approving the Flea Market.");
    }
    await revalidateSpielplatz();
    return true;
  } catch (error) {
    throw new Error("There was a problem approving the Flea Market.");
  }
};

export const updateSpielplatzStatus = async (
  id: number | string,
  status: string
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .update({ status })
      .match({ id });
    if (error) {
      throw new Error("There was a problem updating the Flea Market.");
    }
    await revalidateSpielplatz();
    return true;
  } catch (error) {
    throw new Error("There was a problem updating the Flea Market.");
  }
};

export const getAllSpielplaetzeIds = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("spielplaetze")
      .select("id");
    if (error) {
      throw new Error("Error getting posts IDs from a db");
    }
    return data.map((d) => d.id) as number[];
  } catch (error) {
    return false;
  }
};

//STORAGE

//images

export async function listFilesInFolder(bucket: string, folderName: string) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .list(folderName);

  if (error) {
    console.error("Error listing files:", error);
    return;
  }

  return data;
}

export const getImageURL = async (bucket: string, path: string) =>
  supabaseAdmin.storage.from(bucket).getPublicUrl(path).data.publicUrl;

export const getAllImagesURLFromSupabseFolder = async (
  bucket: string,
  id: string
) => {
  try {
    const files = ((await listFilesInFolder("spielplaetze", id)) || []).filter(
      ({ metadata }) => metadata.mimetype.includes("image")
    );
    const urls = await Promise.all(
      files.map(async (file) => {
        const url = await getImageURL(bucket, `${id}/${file.name}`);
        return { url, fileName: file.name, metadata: file.metadata };
      })
    );

    return urls;
  } catch (error) {
    return [];
  }
};

export const deleteSupabaseFiles = async (
  bucket: string,
  pathWithFilename: string | string[]
) => {
  try {
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove(
        typeof pathWithFilename === "string"
          ? [pathWithFilename]
          : pathWithFilename
      );
    if (error) {
      throw new Error("Error deleting image");
    }
  } catch (error) {
    throw new Error("Error deleting image");
  }
};

export const getSupabaseBucketFoldersList = async (bucket: string) => {
  const { data, error } = await supabaseAdmin.storage.from(bucket).list();

  if (error) {
    console.error("Error listing files:", error);
    return;
  }

  return data;
};

export const deleteUnusedSupabaseImagesFromBucket = async (bucket: string) => {
  try {
    const activeSpielplaetzeIds = (await getAllSpielplaetzeIds()) || [];

    const allImgFolders =
      (await getSupabaseBucketFoldersList("spielplaetze")) || [];
    const deletableFolders = allImgFolders.filter((folder) => {
      return !activeSpielplaetzeIds.includes(parseInt(folder.name));
    });
    Promise.all(
      deletableFolders.map(async ({ name: folderID }) => {
        const { data: files } = await supabaseAdmin.storage
          .from("spielplaetze")
          .list(folderID);
        if (!files) return;
        const filesPaths = files.map(({ name }) => `${folderID}/${name}`);
        const { error: deleteError } = await supabaseAdmin.storage
          .from("spielplaetze")
          .remove(filesPaths);
        if (deleteError) {
          throw new Error("Error deleting images from " + folderID);
        }
      })
    );
    return { error: null };
  } catch (error) {
    return { error: (error as { message: string }).message };
  }
};
