"use client";

import React, { useRef } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import {
  addBulkPosts,
  addNewContributor,
  addNewPost,
  getContributorData,
  updateContributor,
  updatePost,
} from "@app/api/dbActions";
import type {
  iAddress,
  TypeAndText,
  iIgAccount,
  iParsedRetrievedPost,
  iSessionUser,
} from "../../utils/types";
import ImageUploader from "./ImageUploader";
import MarkUpForm from "./MarkUpForm";
import PostFormInput from "./PostFormInput";
import PostTextTypeButtons from "./PostTextTypeButtons";
import DisplayDraft from "./DisplayDraft";
import DeletePost from "./DeletePostButton";
import { useRouter } from "next/navigation";
import { bezirke, categoryNames } from "@app/utils/constants";
import IgAccountInput from "./IgAccountInput";
import { deleteUnusedImages, getFoldersList } from "@app/api/storageActions";

interface PostFormProps {
  PostForm: Partial<iParsedRetrievedPost>;
  user: iSessionUser;
}
export default function PostForm({
  PostForm: {
    id,
    createdAt,
    title,
    text,
    categories,
    tags,
    image,
    link,
    address,
    bezirk,
    minAge,
    maxAge,
    igAccounts,
    lastUpdate,
    pinnedPost,
    user_id,
    addedBy,
  },
  user,
}: PostFormProps) {
  const router = useRouter();
  const [userInput, setUserInput] = React.useState<iSessionUser>(user);
  const [mainImage, setMainImage] = React.useState<string | undefined>(
    image ? image[0] : undefined
  );
  const [imagesUrlsReady, setImagesUrlsReady] = React.useState<{
    ready: boolean;
    urls: string[];
  }>({ ready: false, urls: [] });

  const [contentTextType, setContentTextType] = React.useState<
    "paragraph" | "mixed" | null
  >(null);

  const [savedPostText, setSavedPostText] = React.useState<TypeAndText[]>(
    typeof text === "string" ? [["paragraph", text]] : text || []
  );

  const [categoriesList, setCategoriesList] = React.useState<string[]>(
    categories || []
  );
  const [addressInput, setAddressInput] = React.useState<iAddress | undefined>(
    address || { street: "", number: "", PLZ: "", city: "" }
  );
  const [igAccountsInput, setIgAccountsInput] = React.useState<
    iIgAccount[] | undefined
  >(igAccounts);

  const [submitError, setSubmitError] = React.useState<{
    isError: boolean;
    errorMessage: string;
  }>({ isError: false, errorMessage: "" });

  const newID = useRef(new Date().getTime());
  const postTextAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isDirty, isSubmitting, isLoading },
  } = useForm({
    defaultValues: {
      id: id || newID.current,
      createdAt: createdAt,
      title: title,
      text: text,
      categories: categories,
      tags: tags?.join("-"),
      user_id: user_id,
      addedBy: addedBy,
      link: link,
      street: address?.street || "",
      number: address?.number || "",
      PLZ: address?.PLZ || "",
      city: address?.city || "",
      bezirk: bezirk,
      minAge: minAge,
      maxAge: maxAge,
      igAccounts: igAccounts,
      lastUpdate: lastUpdate,
      pinnedPost: pinnedPost,
    },
  });

  const onSubmitNewPost = (data: FieldValues) => {
    // if (!imagesUrlsReady.ready) return alert("Images are not ready yet");
    if (!savedPostText.length)
      return alert("Text is required and needs to be saved");
    if (!userInput.email || !addedBy) return alert("User is required");
    const post: iParsedRetrievedPost = {
      id: newID.current,
      createdAt: createdAt || newID.current,
      title: data.title,
      text: JSON.stringify([...savedPostText]),
      categories: categoriesList, // provide categories state with multiple categories
      tags: data.tags ? data.tags.split("-").filter(Boolean) : [data.tags],
      image: imagesUrlsReady.urls,
      link: data.link,
      bezirk: data.bezirk,
      minAge: data.minAge ? parseInt(data.minAge) : 0,
      maxAge: data.maxAge ? parseInt(data.maxAge) : undefined,
      igAccounts: igAccountsInput,
      address:
        addressInput && Object.values(addressInput).some((v) => v !== "")
          ? addressInput
          : undefined,
      lastUpdate: newID.current,
      pinnedPost: data.pinnedPost === "true" ? true : false,
      user_id: user_id || userInput.email,
      addedBy: addedBy || userInput,
    };
    addNewPost(post)
      .then(() => {
        console.log("submitted");
        submitError.isError &&
          setSubmitError({ isError: false, errorMessage: "" });
      })
      .then(() => {
        deleteUnusedImages();
      })
      .then(() => {
        addNewContributor(userInput, newID.current);
      })
      .then(() =>
        setTimeout(() => {
          router.push(`/new-post/successfully-submitted/${data.id}`);
        }, 1000)
      )
      .catch((error) =>
        setSubmitError({ isError: true, errorMessage: error.message })
      );
  };

  const onUpdatePost = (data: FieldValues) => {
    // if (!imagesUrlsReady.ready) return alert("Images are not ready yet");
    if (!savedPostText.length)
      return alert("Text is required and needs to be saved");

    if (!user_id || !userInput.email || !addedBy)
      return alert("User data from creator needed");
    const updatedPost: iParsedRetrievedPost = {
      addedBy: addedBy,
      address: addressInput,
      bezirk: data.bezirk,
      categories: categoriesList,
      createdAt: createdAt || newID.current,
      id: data.id,
      igAccounts: igAccountsInput,
      image: imagesUrlsReady.urls,
      lastUpdate: newID.current,
      link: data.link,
      maxAge: data.maxAge ? parseInt(data.maxAge) : undefined,
      minAge: data.minAge ? parseInt(data.minAge) : 0,
      pinnedPost: data.pinnedPost === "true" ? true : false,
      tags: data.tags ? data.tags.split("-").filter(Boolean) : [data.tags],
      text: JSON.stringify([...savedPostText]),
      title: data.title,
      user_id: user_id,
    };
    updatePost(updatedPost)
      .then(() => {
        console.log("updated");
        submitError.isError &&
          setSubmitError({ isError: false, errorMessage: "" });
      })
      .then(() => {
        deleteUnusedImages();
      })
      .then(() => {
        updateContributor(userInput, data.id);
      })
      .then(() =>
        setTimeout(() => {
          router.push(`/update-post/successfully-updated/${data.id}`);
        }, 1000)
      )
      .catch((error) =>
        setSubmitError({ isError: true, errorMessage: error.message })
      );
  };
  if (!user) {
    router.push("/api/auth/signin");
  }
  return (
    <section id="post-form-container">
      <button
        onClick={async () => {
          const a = await getFoldersList();
          console.log("a", a);
        }}
      >
        get contributor
      </button>
      <div className="flex flex-col">
        {Object.entries(userInput)
          .filter(([k, v]) => !v && ["email", "name"].includes(k))
          .map(([key]) => (
            <PostFormInput
              inputLabel={key.toUpperCase()}
              inputID={key as "email" | "name"}
              required={true}
              key={key}
            >
              <input
                type={key === "email" ? "email" : "text"}
                id={key}
                name={key}
                className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
              />
            </PostFormInput>
          ))}
      </div>
      <ImageUploader
        email={user.email || ""}
        setMainImage={setMainImage}
        mainImage={mainImage}
        setImagesUrlsReady={setImagesUrlsReady}
        id={id ? id : newID.current}
      />
      <form
        onSubmit={handleSubmit(id ? onUpdatePost : onSubmitNewPost)}
        className="postForm mx-auto w-full text-gray-900 "
      >
        <div className="mx-auto flex w-full flex-col items-center ">
          <PostFormInput inputLabel="Title" inputID="title" required={true}>
            <>
              <input
                {...register("title", { required: "Title is required" })}
                type="text"
                id="title"
                name="title"
                className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
              />
              {errors.title && (
                <p className="text-red-500">{`${errors.title.message}`}</p>
              )}
            </>
          </PostFormInput>
          <PostFormInput inputLabel="Text" inputID="text" required={true}>
            {savedPostText.length <= 1 ? (
              <div>
                <PostTextTypeButtons
                  setContentTextType={setContentTextType}
                  contentTextType={contentTextType}
                />
                {contentTextType === "paragraph" ? (
                  <>
                    <textarea
                      autoFocus
                      rows={20}
                      id="postText"
                      name="postText"
                      ref={postTextAreaRef}
                      spellCheck="true"
                      onBlur={(e) => {
                        if (e.currentTarget.value !== savedPostText[0]?.[1]) {
                          setSavedPostText([
                            ["paragraph", e.currentTarget.value],
                          ]);
                        }
                      }}
                      defaultValue={savedPostText[0]?.[1]}
                      className="mx-auto block w-full resize-none self-center rounded border border-gray-100 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-6 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-offset-yellow-200"
                    ></textarea>

                    {savedPostText.length > 0 && (
                      <div className="mt-4 max-w-full">
                        <DisplayDraft savedPostText={savedPostText} />
                      </div>
                    )}
                  </>
                ) : (
                  contentTextType === "mixed" && (
                    <MarkUpForm
                      setSavedPostText={setSavedPostText}
                      savedPostText={savedPostText}
                    />
                  )
                )}
              </div>
            ) : (
              <MarkUpForm
                setSavedPostText={setSavedPostText}
                savedPostText={savedPostText}
              />
            )}
          </PostFormInput>
          <PostFormInput
            inputLabel="Categories"
            inputID="categories"
            required={true}
          >
            <div id="categories-box" className="flex flex-wrap gap-4">
              {categoryNames.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    value={category}
                    defaultChecked={categoriesList.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCategoriesList([...categoriesList, category]);
                      } else {
                        setCategoriesList(
                          categoriesList.filter((cat) => cat !== category)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
            </div>
          </PostFormInput>
          <PostFormInput
            inputLabel='Tags (separate each tag with a "-". For example: "spielplatz-pferde")'
            inputID="tags"
          >
            <>
              <input
                {...register("tags", { required: "At least a tag required" })}
                id="tags"
                name="tags"
                placeholder="wasser-sand-spielplatz"
                className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
              />
              {errors.tags && (
                <p className="text-red-500">{`${errors.tags.message}`}</p>
              )}
            </>
          </PostFormInput>
          <PostFormInput inputLabel="Link" inputID="link">
            <input
              {...register("link")}
              id="link"
              placeholder="https://www.example.com"
              name="link"
              className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
            />
          </PostFormInput>
          <PostFormInput inputLabel="Instagram Accounts" inputID="igAccounts">
            <div className="flex flex-col gap-4">
              <IgAccountInput
                handleAddIgAccount={(account: iIgAccount) => {
                  setIgAccountsInput((prev) =>
                    prev ? [...prev, account] : [account]
                  );
                }}
              />
              {igAccountsInput?.map((igAccount) => (
                <div
                  className="flex gap-2 items-center"
                  key={igAccount.name + Math.random()}
                >
                  <button
                    onClick={() => {
                      setIgAccountsInput(
                        igAccountsInput?.filter(
                          (account) => account.name !== igAccount.name
                        )
                      );
                    }}
                    className="bg-red-500 h-8 w-8 text-white rounded-md p-1"
                  >
                    X
                  </button>
                  <div className="accountData">
                    <p className="text-sm font-semibold">@{igAccount.name}</p>
                    <small className="text-xs">{igAccount.description}</small>
                  </div>
                </div>
              ))}
            </div>
          </PostFormInput>
          <div id="minmax-box" className="flex flex-wrap gap-4">
            <div className="minAgeBox w-32">
              <PostFormInput inputLabel="Min. Alter?" inputID="minAge">
                <input
                  {...register("minAge")}
                  id="minAge"
                  name="minAge"
                  type="number"
                  defaultValue={0}
                  className="w-16 block rounded border border-gray-300 bg-gray-100 bg-opacity-60 pr-1 pl-2 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
                />
              </PostFormInput>
            </div>
            <div className="maxAgeBox w-32">
              <PostFormInput inputLabel="Max. Alter?" inputID="maxAge">
                <input
                  {...register("maxAge")}
                  id="maxAge"
                  name="maxAge"
                  type="number"
                  className="w-16 block rounded border border-gray-300 bg-gray-100 bg-opacity-60 pr-1 pl-2 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
                />
              </PostFormInput>
            </div>
          </div>
          <div
            id="location-box"
            className="flex flex-wrap gap-4 w-full lg:w-3/4"
          >
            <div className="bezirkBox min-w-fit w-2/5 flex flex-col">
              <PostFormInput inputLabel="Bezirk" inputID="bezirk">
                <select
                  {...register("bezirk")}
                  defaultValue={bezirk || "Altona"}
                  className="mx  rounded border border-gray-300 bg-gray-100 bg-opacity-95 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
                >
                  {bezirke.map((bezirk) => (
                    <option key={bezirk} value={bezirk}>
                      {bezirk}
                    </option>
                  ))}
                </select>
              </PostFormInput>
            </div>
            <div className="addressBox min-w-fit flex-grow flex flex-col">
              <PostFormInput inputLabel="Addresse" inputID="address">
                <div className="flex flex-col flex-wrap gap-4">
                  <div className="flex gap-2 flex-wrap">
                    <input
                      id="streetInput"
                      name="street"
                      placeholder="Straße"
                      value={addressInput?.street || ""}
                      onChange={(e) => {
                        setAddressInput({
                          ...addressInput,
                          street: e.target.value,
                        });
                      }}
                      className="w-40 block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
                    />
                    <input
                      id="numberInput"
                      name="number"
                      placeholder="Nummer"
                      value={addressInput?.number || ""}
                      onChange={(e) =>
                        setAddressInput({
                          ...addressInput,
                          number: e.target.value,
                        })
                      }
                      className="w-24 block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <input
                      id="PLZInput"
                      value={addressInput?.PLZ || ""}
                      name="PLZ"
                      placeholder="PLZ"
                      onChange={(e) =>
                        setAddressInput({
                          ...addressInput,
                          PLZ: e.target.value,
                        })
                      }
                      className="w-24 block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
                    />
                    <input
                      id="cityInput"
                      name="city"
                      value={addressInput?.city || ""}
                      placeholder="Stadt"
                      onChange={(e) =>
                        setAddressInput({
                          ...addressInput,
                          city: e.target.value,
                        })
                      }
                      className="w-40 block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
                    />
                  </div>
                </div>
              </PostFormInput>
            </div>{" "}
          </div>
          {/* falta iglocation, address  */}

          <PostFormInput inputLabel="Pinned Post?" inputID="pinnedPost">
            <select
              {...register("pinnedPost")}
              defaultChecked={pinnedPost}
              className="mx-4  rounded border border-gray-300 bg-gray-100 bg-opacity-95 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-[rgb(225,159,65,0.6)] focus:bg-white focus:ring-2 focus:ring-[rgb(225,159,65,0.5)]"
            >
              <option value="false">False</option>
              <option value="true">True</option>
            </select>
          </PostFormInput>

          <div className="flex w-full flex-col items-center justify-between gap-8 p-2 sm:flex-row">
            {id && <DeletePost id={id} title={title || ""} />}
            {/* {!imagesUrlsReady.ready ? (
              <a
                href="#images-upload-container"
                type="button"
                className="mr-auto flex w-fit rounded border-0 bg-[rgb(225,159,65,0.6)] px-8 py-2 text-lg text-white transition-colors  duration-200 ease-in-out hover:bg-[rgb(225,159,65,0.9)] hover:shadow-md focus:outline-2 focus:ring-2 focus:ring-[rgb(225,159,65,0.5)] focus:ring-offset-2"
              >
                {!!imagesUrlsReady.urls.length
                  ? "First upload the image/s"
                  : "Add one or more images"}{" "}
                ↑
              </a>
            ) : ( */}
            <button
              type="submit"
              disabled={isSubmitSuccessful || isSubmitting || isLoading}
              //   (!isDirty &&
              //     JSON.stringify(imagesUrlsReady.urls) ===
              //       JSON.stringify([images]))
              // }
              className={`${
                isSubmitSuccessful
                  ? " bg-[hsla(119,23%,47%,1)] hover:bg-[rgba(68,225,65,0.65)] hover:shadow-none"
                  : "bg-[rgb(225,159,65,0.6)] hover:bg-[rgb(225,159,65,0.9)] hover:shadow-md"
              } border-0px-8 ml-auto flex rounded p-2 text-lg text-white transition-colors  duration-200 ease-in-out  focus:outline-2 focus:ring-2 focus:ring-[rgb(225,159,65,0.5)] focus:ring-offset-2 disabled:bg-gray-500`}
            >
              {isSubmitSuccessful
                ? id
                  ? "Successfully Updated ✓"
                  : "Successfully Submitted ✓"
                : isDirty ||
                  JSON.stringify(imagesUrlsReady.urls) !==
                    JSON.stringify([image])
                ? id
                  ? "Update Post"
                  : "Add New Post"
                : "Nothing to submit"}
            </button>
            {/* )} */}
            {submitError.isError && (
              <p className="mt-4 rounded border-4 border-red-700 p-4 font-semibold text-red-700">{`There was an error while submitting the post. Error message: ${submitError.errorMessage}`}</p>
            )}
          </div>
        </div>
      </form>
      <button onClick={() => addBulkPosts([])}>add bulk</button>
    </section>
  );
}
