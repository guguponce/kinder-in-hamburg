"use client";

import React, { useRef } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { addFlohmarkt, updateFlohmarkt } from "@app/api/dbActions";
import type { iSessionUser, iFlohmarkt } from "../../utils/types";
import { useRouter } from "next/navigation";
import { addressPartsArray, bezirke } from "@app/utils/constants";
import {
  getEndTime,
  getStartTime,
  joinAddress,
  joinTime,
  separateAddress,
  sleep,
} from "@app/utils/functions";
import FlohmarktImageUploader from "./FlohmarktImageUploader";
import PostFormInput from "../@PostForm/PostFormInput";
import { revalidatePost } from "@app/utils/actions/revalidate";
import UserInputBox from "./UserInputBox";
import DeleteButton from "../DeleteButton";

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
    location,
    time,
    optionalComment,
  },
  user,
  flohFormType,
}: FlohFormProps) {
  const router = useRouter();
  const [userInput, setUserInput] = React.useState<iSessionUser>(
    addedBy || user
  );
  const [imagesUrlsReady, setImagesUrlsReady] = React.useState<{
    ready: boolean;
    urls: string[];
  }>({ ready: true, urls: [] });
  const addressData = address
    ? separateAddress(address)
    : { street: "", number: "", PLZ: "", city: "" };
  const [successfulSubmit, setSuccessfulSubmit] =
    React.useState<boolean>(false);

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
      startTime: getStartTime(time),
      endTime: getEndTime(time),
      street: addressData.street,
      number: addressData.number,
      PLZ: addressData.PLZ,
      city: addressData.city,
      location: location,
      image: image,
      optionalComment: optionalComment || "",
    },
  });

  const onSubmitNewFlohmarkt = (data: FieldValues) => {
    if (!imagesUrlsReady.ready) alert("Images are not ready yet");
    if (!userInput.email || !userInput.name)
      return alert("Your name and email are required");
    if (!data.date) alert("The date of the Flohmarkt is required");
    if (!data.startTime && data.endTime)
      alert("Please provide the start and end time of the Flohmarkt");
    const suggestionFloh: iFlohmarkt = {
      id: data.id,
      status: data.status,
      createdAt: createdAt || newID.current,
      title: data.title,
      addedBy: userInput,
      bezirk: data.bezirk,
      date: data.date,
      address: joinAddress(data),
      location: data.location,
      time: joinTime(data.startTime, data.endTime),
      image: imagesUrlsReady.urls[0] || "",
      optionalComment: data.optionalComment,
    };

    addFlohmarkt(suggestionFloh)
      .then(() => {
        revalidatePost();
        setSubmitError({ isError: false, errorMessage: "" });
        setSuccessfulSubmit(true);
      })
      .then(() => {
        // deleteUnusedFlohmaerkteImages();
      })
      .then(async () => {
        sleep(750);
        router.push(`/new-flohmarkt/successfully-submitted/${data.id}`);
      })
      .catch((error) =>
        setSubmitError({ isError: true, errorMessage: error.message })
      );
  };

  const onUpdateFlohmarkt = (data: FieldValues) => {
    if (!imagesUrlsReady.ready) return alert("Images are not ready yet");
    if (!userInput.email || !addedBy)
      return alert("User data from creator needed");
    if (!data.date) alert("The date of the Flohmarkt is required");
    if (!data.startTime && data.endTime)
      alert("Please provide the start and end time of the Flohmarkt");
    const updatedFlohmarkt: iFlohmarkt = {
      id: id || newID.current,
      status: data.status,
      createdAt: createdAt || newID.current,
      time: joinTime(data.startTime, data.endTime),
      title: data.title,
      addedBy: userInput,
      bezirk: data.bezirk,
      date: data.date,
      address: `${data.street} ${data.number}, ${data.PLZ} ${data.city}`,
      location: data.location,

      image: imagesUrlsReady.urls[0] || "",
      optionalComment: data.optionalComment,
    };
    updateFlohmarkt(updatedFlohmarkt)
      .then(() => {
        setSubmitError({ isError: false, errorMessage: "" });
        revalidatePost();
        setSuccessfulSubmit(true);
      })
      // .then(() => {
      // deleteUnusedFlohmaerkteImages();
      // })
      .then(async () => {
        await sleep(750);
        router.push(
          flohFormType === "update-flohmarkt"
            ? `/update-flohmarkt/successfully-submitted/${data.id}`
            : flohFormType === "update-suggestion"
            ? `/update-flohmarkt/successfully-submitted/${data.id}`
            : `/flohmaerkte-approval/successfully-approved/${data.id}`
        );
      })
      .catch((error) =>
        setSubmitError({ isError: true, errorMessage: error.message })
      );
  };

  if (!user) {
    router.push("/");
  }

  if (!user.email || !user.name) return;

  return (
    <section id="flohmarkt-form-container" className="w-full">
      <UserInputBox setUserInput={setUserInput} userInput={userInput} />
      <FlohmarktImageUploader
        user={userInput}
        setImagesUrlsReady={setImagesUrlsReady}
        id={id ? id : newID.current}
      />
      <form
        onSubmit={handleSubmit(
          flohFormType === "new-flohmarkt"
            ? onSubmitNewFlohmarkt
            : onUpdateFlohmarkt
        )}
        className="flohForm mx-auto w-full text-gray-900 lg:w-3/4"
      >
        <div className="mx-auto flex w-full flex-col items-center gap-2 ">
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
                  {...register("bezirk", { required: "Bezirk is required" })}
                  defaultValue={bezirk || "Altona"}
                  required
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
              <PostFormInput
                inputLabel="Address"
                inputID="address"
                required={true}
              >
                <div className="flex flex-col flex-wrap gap-2">
                  <input
                    {...register("street", {
                      required: "Full address is required",
                    })}
                    id={"street" + "Input"}
                    name="street"
                    placeholder="Straße"
                    className="w-full block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                  />

                  <input
                    {...register("number", {
                      required: "Full address is required",
                    })}
                    id={"number" + "Input"}
                    name="number"
                    placeholder="Nummer"
                    className="w-full block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                  />

                  <input
                    {...register("PLZ", {
                      required: "Full address is required",
                    })}
                    id={"PLZ" + "Input"}
                    name="PLZ"
                    placeholder="PLZ"
                    className="w-full block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                  />

                  <input
                    {...register("city", {
                      required: "Full address is required",
                    })}
                    id={"city" + "Input"}
                    name={"city"}
                    placeholder="Stadt"
                    className="w-full block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                  />
                </div>
              </PostFormInput>
              {addressPartsArray
                .filter((p) => !!errors[p])
                .slice(0, 1)
                .map((p) =>
                  !!errors[p] ? (
                    <p className="text-negative-500" key={p}>{`${
                      errors[p]!.message
                    }`}</p>
                  ) : (
                    <React.Fragment key={p}></React.Fragment>
                  )
                )}
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
                          : undefined
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
              <div className="w-full max-w-[600px] p-2 rounded bg-hh-100 bg-opacity-20">
                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-col gap-1 flex-wrap">
                    <label
                      htmlFor="starttime"
                      className="text-md font-semibold leading-7 w-fit"
                    >
                      Startzeit
                    </label>
                    <input
                      id="starttime"
                      name="starttime"
                      type="time"
                      defaultValue={getStartTime(time)}
                      onChange={(e) => setValue("startTime", e.target.value)}
                      className="w-fit block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-wrap">
                    <label
                      htmlFor="endtime"
                      className="text-md font-semibold leading-7 w-fit"
                    >
                      Endzeit
                    </label>
                    <input
                      id="endtime"
                      name="endtime"
                      type="time"
                      defaultValue={getEndTime(time)}
                      onChange={(e) => setValue("endTime", e.target.value)}
                      className="w-fit block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                    />
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>

          <PostFormInput
            inputLabel="Optionaler Kommentar"
            inputID="optionalComment"
          >
            <textarea
              onChange={(e) => setValue("optionalComment", e.target.value)}
              id="title"
              defaultValue={optionalComment || ""}
              name="title"
              className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
            />
          </PostFormInput>

          <div className="flex w-full flex-wrap items-center justify-between gap-8 p-2 sm:flex-row">
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
              disabled={successfulSubmit || isSubmitting || isLoading}
              className={`${
                successfulSubmit
                  ? " bg-slate-300 hover:shadow-none"
                  : "bg-green-700 hover:bg-green-600 hover:shadow-md ml-auto"
              } active:scale-[0.99] border-0px-8  flex rounded p-2 text-lg text-white transition-colors  duration-200 ease-in-out  focus:outline-2 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-gray-500`}
            >
              {JSON.stringify(imagesUrlsReady.urls) !== JSON.stringify([image])
                ? flohFormType === "new-flohmarkt"
                  ? "Submit Flohmarkt Suggestion"
                  : status === "approved"
                  ? flohFormType === "update-flohmarkt"
                    ? "Update Flohmarkt"
                    : "Approve Flohmarkt"
                  : "Update Flohmarkt Suggestion"
                : "Done"}
            </button>
            {submitError.isError && (
              <p className="mt-4 rounded border-4 border-negative-700 p-4 font-semibold text-negative-700">{`There was an error while submitting the Flohmarkt. Error message: ${submitError.errorMessage}`}</p>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
