"use client";

import React, { useRef } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { addFlohmarkt, updateFlohmarkt } from "@app/api/dbActions";
import type { iSessionUser, iFlohmarkt } from "../../utils/types";
import { useRouter } from "next/navigation";
import { bezirke } from "@app/utils/constants";
import { joinAddress, separateAddress } from "@app/utils/functions";
import ImageUploader from "../@PostForm/ImageUploader";
import PostFormInput from "../@PostForm/PostFormInput";
import { revalidate } from "@app/utils/actions/revalidate";
import UserInputBox from "./UserInputBox";

interface FlohFormProps {
  FlohForm: Partial<iFlohmarkt>;
  user: iSessionUser;
  children?: React.ReactNode;
  flohFormType:
    | "new-flohmarkt"
    | "update-flohmarkt"
    | "update-suggestion"
    | "approve-suggestion";
}
export default function FlohForm({
  FlohForm: {
    id,
    createdAt,
    title,
    image,
    address,
    bezirk,
    addedBy,
    status,
    date,
    free,
    location,
    time,
  },
  user,
  flohFormType,
}: FlohFormProps) {
  const router = useRouter();
  const [userInput, setUserInput] = React.useState<iSessionUser>(user);
  const [imagesUrlsReady, setImagesUrlsReady] = React.useState<{
    ready: boolean;
    urls: string;
  }>({ ready: true, urls: "" });
  const addressData = address
    ? separateAddress(address)
    : { street: "", number: "", PLZ: "", city: "" };
  const [approved, setApproved] = React.useState<boolean>(
    status === "approved" ? true : false
  );

  const [submitError, setSubmitError] = React.useState<{
    isError: boolean;
    errorMessage: string;
  }>({ isError: false, errorMessage: "" });

  const newID = useRef(new Date().getTime());

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitSuccessful, isDirty, isSubmitting, isLoading },
  } = useForm({
    defaultValues: {
      status: status || "pending",
      id: id || newID.current,
      createdAt: createdAt,
      title: title,
      addedBy: addedBy,
      bezirk: bezirk,
      date: date,
      time: time,
      free: free ? true : false || true,
      street: addressData.street,
      number: addressData.number,
      PLZ: addressData.PLZ,
      city: addressData.city,
      location: location,

      image: image,
    },
  });

  const onSubmitNewFlohmarkt = (data: FieldValues) => {
    if (!imagesUrlsReady.ready) return alert("Images are not ready yet");
    if (!userInput.email || !userInput.name)
      return alert("Your name and email are required");
    const suggestionFloh: iFlohmarkt = {
      id: data.id,
      status: data.status,
      createdAt: createdAt || newID.current,
      title: data.title,
      addedBy: userInput,
      bezirk: data.bezirk,
      date: data.date,
      free: data.free,
      address: joinAddress(data),
      location: data.location,
      time: data.time,
      image: imagesUrlsReady.urls,
    };
    addFlohmarkt(suggestionFloh)
      .then(() => {
        revalidate();
        setSubmitError({ isError: false, errorMessage: "" });
      })
      .then(() => {
        // deleteUnusedImages();
      })
      .then(() =>
        setTimeout(() => {
          router.push(`/new-flohmarkt/successfully-submitted/${data.id}`);
        }, 1000)
      )
      .catch((error) =>
        setSubmitError({ isError: true, errorMessage: error.message })
      );
  };

  const onUpdateFlohmarkt = (data: FieldValues) => {
    if (!imagesUrlsReady.ready) return alert("Images are not ready yet");

    if (!userInput.email || !addedBy)
      return alert("User data from creator needed");
    const updatedPost: iFlohmarkt = {
      id: id || newID.current,
      status: approved ? "approved" : status || "pending",
      createdAt: createdAt || newID.current,

      title: data.title,
      addedBy: userInput,
      bezirk: data.bezirk,
      date: data.date,
      free: data.free,
      address: `${data.street} ${data.number}, ${data.PLZ} ${data.city}`,
      location: data.location,
      time: data.time,
      image: imagesUrlsReady.urls,
    };
    updateFlohmarkt(updatedPost)
      .then((res) => {
        setSubmitError({ isError: false, errorMessage: "" });
        revalidate();
      })
      // .then(() => {
      // deleteUnusedImages();
      // })
      .then(() =>
        setTimeout(() => {
          router.push(
            flohFormType === "update-flohmarkt"
              ? `/flohmaerkte/update-post/successfully-updated/${data.id}`
              : flohFormType === "update-suggestion"
              ? `//update-suggested-flohmarkt//successfully-updated/${data.id}`
              : `/flohmaerkte-approval/successfully-approved/${data.id}`
          );
        }, 1000)
      )
      .catch((error) =>
        setSubmitError({ isError: true, errorMessage: error.message })
      );
  };

  if (!user) {
    router.push("/");
  }

  if (!user.email || !user.name) return;

  return (
    <section id="post-form-container" className="w-full">
      {/* {(!user.email || user.name) && ( */}
      <UserInputBox setUserInput={setUserInput} userInput={userInput} />
      {/* )} */}
      {/* <ImageUploader
        email={user.email || ""}
        setImagesUrlsReady={setImagesUrlsReady}
        id={id ? id : newID.current}
      /> */}
      <form
        onSubmit={handleSubmit(
          flohFormType === "new-flohmarkt"
            ? onSubmitNewFlohmarkt
            : onUpdateFlohmarkt
        )}
        className="flohForm mx-auto w-full text-gray-900 lg:w-3/4"
      >
        <div className="mx-auto flex w-full flex-col items-center gap-2 ">
          {/* day
month
year
hour
minute */}
          <PostFormInput inputLabel="Title" inputID="title" required={true}>
            <>
              <input
                {...register("title", { required: "Title is required" })}
                type="text"
                id="title"
                name="title"
                className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
              />
              {errors.title && (
                <p className="text-negative-500">{`${errors.title.message}`}</p>
              )}
            </>
          </PostFormInput>

          <div
            id="address-box"
            className=" w-full max-w-[600px] flex flex-wrap gap-4"
          >
            <div className="bezirkBox min-w-fit w-2/5 flex flex-col">
              <PostFormInput
                inputLabel="Bezirk"
                inputID="bezirk"
                required={true}
              >
                <select
                  {...register("bezirk")}
                  defaultValue={bezirk || "Altona"}
                  className="mx  rounded border border-gray-300 bg-gray-100 bg-opacity-95 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                >
                  {bezirke.map((bezirk) => (
                    <option key={bezirk} value={bezirk}>
                      {bezirk}
                    </option>
                  ))}
                </select>
              </PostFormInput>

              <PostFormInput inputLabel="Standort" inputID="location">
                <>
                  <input
                    {...register("location")}
                    type="text"
                    id="location"
                    name="location"
                    placeholder="(z.B. Apostolkirche, Schüle, etc.)"
                    className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                  />
                </>
              </PostFormInput>
            </div>
            <div className="addressBox min-w-fit  flex-grow flex flex-col">
              <PostFormInput inputLabel="Addresse" inputID="address">
                <div className="flex flex-col flex-wrap gap-4">
                  {["street", "number", "PLZ", "city"].map((part, i) => (
                    <div className="flex gap-2 flex-wrap" key={part}>
                      <input
                        {...register(
                          part as "street" | "number" | "PLZ" | "city"
                        )}
                        id={part + "Input"}
                        name={part + i}
                        placeholder={
                          part === "street"
                            ? "Straße"
                            : part === "number"
                            ? "Nummer"
                            : part === "PLZ"
                            ? "PLZ"
                            : "Stadt"
                        }
                        className="w-full block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                      />
                    </div>
                  ))}
                </div>
              </PostFormInput>
            </div>{" "}
          </div>

          <div
            id="date-time-box"
            className="flex flex-wrap gap-4 w-full max-w-[600px] justify-center items-center"
          >
            <div className="dateBox min-w-fit flex-grow flex flex-col">
              <PostFormInput inputLabel="Datum" inputID="date" required={true}>
                <div className="flex flex-col flex-wrap gap-4">
                  <div className="flex gap-2 flex-wrap">
                    <input
                      defaultValue={
                        date
                          ? new Date(date).toISOString().split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                      id={date + "Input"}
                      name={"date"}
                      type="date"
                      onChange={(e) =>
                        setValue("date", new Date(e.target.value).getTime())
                      }
                      className="w-full block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                    />
                  </div>
                </div>
              </PostFormInput>
            </div>{" "}
            <div className="timeBox min-w-fit flex-grow flex flex-col">
              <PostFormInput inputLabel="Uhrzeit" inputID="time">
                <div className="flex flex-col flex-wrap gap-4">
                  <div className="flex gap-2 flex-wrap">
                    <input
                      id={time + "Input"}
                      name={"time"}
                      type="time"
                      defaultValue={time}
                      onChange={(e) => setValue("time", e.target.value)}
                      className="w-40 block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                    />
                  </div>
                </div>
              </PostFormInput>
            </div>{" "}
          </div>

          <div className="p-2 rounded bg-hh-100 bg-opacity-20 m-1">
            <div className="relative flex mx-auto flex-row w-fit items-center gap-4">
              <label
                htmlFor={"free"}
                className="text-md font-semibold leading-7 w-fit"
              >
                Kostenlos
              </label>

              <input
                onChange={(e) => setValue("free", e.target.checked)}
                type="checkbox"
                defaultChecked={flohFormType === "new-flohmarkt" ? true : free}
                id="free"
                name="free"
                className="block w-4 h-4  rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
              />
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-8 p-2 sm:flex-row">
            {/* {id && (
              <DeletePostButton
                id={id}
                title={title || ""}
                deleteFrom="approved"
              />
            )} */}
            {!imagesUrlsReady.ready && (
              <a
                href="#images-upload-container"
                type="button"
                className="mr-auto flex w-fit rounded border-0 bg-hh-600 px-8 py-2 text-lg text-white transition-colors  duration-200 ease-in-out hover:bg-green-600 hover:shadow-md focus:outline-2 focus:ring-2 focus:ring-hh-700 focus:ring-offset-2"
              >
                First upload the image/s ↑
              </a>
            )}

            <button
              type="submit"
              disabled={
                // isSubmitSuccessful || isSubmitting || isLoading||
                !isDirty &&
                JSON.stringify(imagesUrlsReady.urls) === JSON.stringify([image])
              }
              className={`${
                isSubmitSuccessful
                  ? " bg-[hsla(119,23%,47%,1)] hover:bg-[rgba(68,225,65,0.65)] hover:shadow-none ml-0"
                  : "bg-green-700 hover:bg-green-600 hover:shadow-md ml-auto"
              } active:scale-[0.99] border-0px-8  flex rounded p-2 text-lg text-white transition-colors  duration-200 ease-in-out  focus:outline-2 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-gray-500`}
            >
              {isDirty ||
              JSON.stringify(imagesUrlsReady.urls) !== JSON.stringify([image])
                ? flohFormType === "new-flohmarkt"
                  ? "Submit Flohmarkt Suggestion"
                  : status === "approved"
                  ? flohFormType === "update-flohmarkt"
                    ? "Update Flohmarkt"
                    : "Approve Flohmarkt"
                  : "Update Flohmarkt Suggestion"
                : "No changes made"}
            </button>
            {/* )} */}
            {submitError.isError && (
              <p className="mt-4 rounded border-4 border-negative-700 p-4 font-semibold text-negative-700">{`There was an error while submitting the post. Error message: ${submitError.errorMessage}`}</p>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}

// <AdminClientComponent>
// <div className="border-positive-700 border-2 text-hh-100 flex p-4 rounded">
//   <label
//     htmlFor="approved"
//     className="text-md mx-auto font-semibold leading-7 flex flex-col items-center"
//   >
//     Approved
//     <input
//       onChange={(e) =>
//         setValue(
//           "status",
//           e.target.checked ? "approved" : status || "pending"
//         )
//       }
//       type="checkbox"
//       id="approved"
//       name="approved"
//       className="w-[2rem] h-[2rem] mt-2 border rounded-full border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1  outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
//     />
//   </label>
// </div>
// </AdminClientComponent>
