"use server";
import type {
  iBezirk,
  iSpielplatz,
  iStringifiedSpielplatz,
  iSessionUser,
} from "@app/utils/types";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { checkBezirk, parseSpielplatz } from "@app/utils/functions";
import { revalidatePath } from "next/cache";
import { FullMetadata } from "firebase/storage";
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
      .select("*");
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
      .select("*")
      .neq("status", "approved");
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
    const session = await getServerUser();
    if (!session?.user?.email) {
      return "Not logged in";
    }
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
      addedBy: JSON.stringify(session.user),
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
    return data.map((d) => d.id);
  } catch (error) {
    return false;
  }
};

//STORAGE

//images

export async function listFilesInFolder(folderName: string) {
  const { data, error } = await supabaseAdmin.storage
    .from("spielplaetze")
    .list(folderName);

  if (error) {
    console.error("Error listing files:", error);
    return;
  }

  return data;
}

export const getImageURL = async (path: string) =>
  supabaseAdmin.storage.from("spielplaetze").getPublicUrl(path).data.publicUrl;

export const getAllSpielplatzImagesURL = async (id: string) => {
  const files = await listFilesInFolder(id);
  const urls = files
    ? Promise.all(
        files.map(async (file) => await getImageURL(`${id}/${file.name}`))
      )
    : [];
  return urls;
};
export async function handleUploadToSupabaseStorage(file: File) {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from("spielplaetze")
      .upload(`public/${file.name}`, file);

    if (error) {
      console.error("Supabase upload error details:", error);
      throw error;
    }
  } catch (error) {
    throw error; // Rethrow the error so it can be caught in handleUpload
  }
}

export const uploadSpielplatzImage = (
  userEmail: iSessionUser,
  id: string,
  // file: File,
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
    // contentType: file.type,
    // size: file.size,
    // name: file.name,
    postID: id,
    uploadedBy: JSON.stringify({
      email: userEmail.email,
      name: userEmail.name,
    }),
  };

  // const storageRef = ref(storage, `flohmaerkteImages/${id}/${file.name}`);
  // // Upload file and get status
  // return new Promise(async (res, rej) => {
  //   const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       if (progress === 100) console.log("Upload is done");
  //       switch (snapshot.state) {
  //         case "paused":
  //           statusSetter("paused");
  //           break;
  //         case "running":
  //           statusSetter("uploading");
  //           break;
  //       }
  //     },
  //     (error) => {
  //       statusSetter("error");
  //     },
  //     // After uploaded get metadata and download URL
  //     async () => {
  //       const metadata = await getMetadata(uploadTask.snapshot.ref);
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         console.log("downloadURL", downloadURL);
  //         imgUrlsSetter((prev) => [
  //           { url: downloadURL, fileName: file.name, metadata },
  //         ]);
  //       });
  //       statusSetter("await");
  //       res("success");
  //     }
  //   );
  // });
};
