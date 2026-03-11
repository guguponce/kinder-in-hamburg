import { createClient } from "@auth/client";
import React from "react";
import { getAllEventsIds, getAllPostsIds } from "@app/api/dbActions";
import { imageDataURLSetter } from "@app/utils/types";
//POST
export const uploadPostImage = async (
  userEmail: string,
  bucket: string,
  id: string | number,
  file: File,
  imgUrlsSetter: imageDataURLSetter,
  statusSetter: React.Dispatch<
    React.SetStateAction<
      "uploading" | "success" | "error" | "paused" | "await" | "converting"
    >
  >,
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
  const path = `${id}/${file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const supabaseAdminClient = createClient();
  try {
    const { data, error } = await supabaseAdminClient.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Error uploading image to Supabase:", error.message);
      statusSetter("error");
      return;
    }
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
    imgUrlsSetter((prev) => [
      ...prev,
      { url: publicUrl, fileName: file.name, metadata },
    ]);
    statusSetter("await");
  } catch (error) {
    console.error("Unexpected error uploading image to Supabase:", error);
    statusSetter("error");
  }
};

export const uploadFlohmarktImage = async (
  userEmail: string,
  userName: string,
  id: string,
  file: File,
  imgUrlsSetter: React.Dispatch<
    React.SetStateAction<
      Array<{ url: string; fileName: string; metadata?: Record<string, any> }>
    >
  >,
  statusSetter: React.Dispatch<
    React.SetStateAction<"uploading" | "success" | "error" | "paused" | "await">
  >,
) => {
  // Create Metadata
  const metadata = {
    contentType: file.type,
    size: file.size,
    name: file.name,
    postID: id,
    uploadedBy: JSON.stringify({
      email: userEmail,
      userName: userName,
      name: userName,
    }),
  };
  const path = `${id}/${file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const supabaseAdminClient = createClient();
  try {
    const { data, error } = await supabaseAdminClient.storage
      .from("flohmaerkte")
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Error uploading image to Supabase:", error.message);
      statusSetter("error");
      return;
    }
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/flohmaerkte/${path}`;
    const newImage = { url: publicUrl, fileName: file.name, metadata };
    imgUrlsSetter([newImage]);
    statusSetter("await");
  } catch (error) {
    console.error("Unexpected error uploading image to Supabase:", error);
    statusSetter("error");
  }
};

export async function handleUploadToSupabaseStorage(
  id: number | string,
  bucket: string,
  file: File,
  folder?: string,
) {
  const supabaseAdminClient = createClient();
  const path = folder
    ? `${folder}/${file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_")}`
    : `${id}/${file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  try {
    const { data, error } = await supabaseAdminClient.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: true,
      });
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

export const uploadSpielplatzImage = async (
  userEmail: string,
  bucket: string,
  id: string | number,
  file: File,
  imgUrlsSetter: imageDataURLSetter,
  statusSetter: React.Dispatch<
    React.SetStateAction<
      "uploading" | "success" | "error" | "paused" | "await" | "converting"
    >
  >,
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
  const path = `${id}/${file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const supabaseAdminClient = createClient();
  try {
    const { data, error } = await supabaseAdminClient.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Error uploading image to Supabase:", error.message);
      statusSetter("error");
      return;
    }
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
    imgUrlsSetter((prev) => [
      ...prev,
      { url: publicUrl, fileName: file.name, metadata },
    ]);
    statusSetter("await");
  } catch (error) {
    console.error("Unexpected error uploading image to Supabase:", error);
    statusSetter("error");
  }
};
