"use client";

import React, { useCallback, useMemo, useRef } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { addEvent, updateEvent } from "@app/api/dbActions";
import type { iSessionUser, iFlohmarkt, iBezirk } from "../../utils/types";
import { useRouter } from "next/navigation";
import {
  BEZIRK_TO_STADTTEILE,
  addressPartsArray,
  bezirke,
  eventTypes,
} from "@app/utils/constants";
import {
  getEndTime,
  getLatLong,
  getStartTime,
  joinAddress,
  joinTime,
  separateAddress,
  sleep,
} from "@app/utils/functions";
import FlohmarktImageUploader from "./FlohmarktImageUploader";
import PostFormInput from "../@PostForm/PostFormInput";
import {
  revalidateFlohmarkt,
  revalidatePost,
} from "@app/utils/actions/revalidate";
import UserInputBox from "./UserInputBox";
import { deleteUnusedFlohmaerkteImages } from "@app/api/storageActions";
import dynamic from "next/dynamic";
import Button from "../@Buttons/Button";

const LatLonSetterMap = dynamic(() => import("../@Map/LatLonSetterMap"), {
  ssr: false,
});

interface FlohFormProps {
  FlohForm: Partial<iFlohmarkt>;
  user: iSessionUser;
  children?: React.ReactNode;
  flohFormType:
    | "new-flohmarkt"
    | "update-flohmarkt"
    | "update-suggestion"
    | "approve-suggestion"
    | "new-event"
    | "update-event";
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
    type,
    stadtteil,
    lat,
    lon,
    endDate,
    closedDates,
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
  const addressData = useMemo(
    () =>
      address
        ? separateAddress(address)
        : { street: "", number: "", PLZ: "", city: "" },
    [address]
  );
  const [successfulSubmit, setSuccessfulSubmit] =
    React.useState<boolean>(false);

  const [submitError, setSubmitError] = React.useState<{
    isError: boolean;
    errorMessage: string;
  }>({ isError: false, errorMessage: "" });
  const [bezirkInput, setBezirkInput] = React.useState<iBezirk>(
    bezirk || "Altona"
  );
  const [latlon, setLatLon] = React.useState({ lat, lon });
  const [closedDatesArray, setClosedDates] = React.useState<number[]>(
    closedDates || []
  );
  const newID = useRef(Date.now());
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitSuccessful, isDirty, isSubmitting, isLoading },
  } = useForm({
    defaultValues: {
      status: status || "pending",
      id: id || newID.current,
      createdAt: createdAt,
      title: title,
      addedBy: addedBy,
      bezirk: bezirk,
      stadtteil: stadtteil,
      date: date,
      lat: lat,
      lon: lon,
      startTime: getStartTime(time),
      endTime: getEndTime(time),
      street: addressData.street,
      number: addressData.number,
      PLZ: addressData.PLZ,
      city: addressData.city,
      location: location,
      image: image,
      optionalComment: optionalComment || "",
      type: type || "",
      endDate,
      closedDates: closedDatesArray.filter((d) => !Number.isNaN(d)),
    },
  });
  const onSubmitNewFlohmarkt = useCallback(
    (data: FieldValues) => {
      if (!imagesUrlsReady.ready) {
        alert("Images are not ready yet");
        return;
      }
      if (!userInput.email || !userInput.name)
        return alert("Your name and email are required");
      if (!data.date) {
        alert("The date of the Flohmarkt is required");
        return;
      }
      if (!data.startTime && data.endTime) {
        alert("Please provide the start and end time of the Flohmarkt");
        return;
      }
      if (
        (flohFormType === "update-event" || flohFormType === "new-event") &&
        !data.type
      )
        return alert("Please provide the type of the event");
      const eventSuggestion: iFlohmarkt = {
        id: data.id,
        status: data.status,
        createdAt: createdAt || newID.current,
        title: data.title,
        addedBy: userInput,
        bezirk: data.bezirk,
        stadtteil: data.stadtteil,
        date: data.date,
        lat: data.lat,
        lon: data.lon,
        address: joinAddress(data),
        location: data.location,
        time: joinTime(data.startTime, data.endTime),
        image: imagesUrlsReady.urls[0] || "",
        optionalComment: data.optionalComment,
        type: !!data.type ? data.type : undefined,

        endDate: data.endDate,
        closedDates: closedDatesArray.filter((d) => !Number.isNaN(d)),
      };
      addEvent(
        eventSuggestion,
        flohFormType === "new-event" ? "events" : "flohmaerkte"
      )
        .then(() => {
          revalidatePost();
          revalidateFlohmarkt();

          setSubmitError({ isError: false, errorMessage: "" });
          setSuccessfulSubmit(true);
        })
        .then(() => {
          deleteUnusedFlohmaerkteImages();
        })
        .then(async () => {
          sleep(3000);
          router.push(
            flohFormType === "new-flohmarkt"
              ? `/flohmarkt-suggestion/${data.id}`
              : `/events/${data.id}`
          );
        })
        .catch((error) => {
          console.log(error);
          setSubmitError({ isError: true, errorMessage: error.message });
        });
    },
    [
      imagesUrlsReady,
      userInput,
      router,
      flohFormType,
      createdAt,
      closedDatesArray,
    ]
  );

  const onupdateEvent = useCallback(
    (data: FieldValues) => {
      if (!imagesUrlsReady.ready) return alert("Images are not ready yet");
      if (!userInput.email || !addedBy)
        return alert("User data from creator needed");
      if (!data.date) return alert("The date of the Event is required");
      if (!data.startTime && data.endTime)
        return alert("Please provide the start and end time of the Event");
      if (
        (flohFormType === "update-event" || flohFormType === "new-event") &&
        !data.type
      )
        return alert("Please provide the type of the event");
      const updatedEvent: iFlohmarkt = {
        id: id || newID.current,
        status: data.status,
        createdAt: createdAt || newID.current,
        time: joinTime(data.startTime, data.endTime),
        title: data.title,
        addedBy: userInput,
        bezirk: data.bezirk,
        stadtteil: data.stadtteil,
        date: data.date,
        address: `${data.street} ${data.number}, ${data.PLZ} ${data.city}`,
        location: data.location,
        lat: data.lat,
        lon: data.lon,
        image: imagesUrlsReady.urls[0] || "",
        optionalComment: data.optionalComment,
        type: !!data.type ? data.type : undefined,

        endDate: data.endDate,
        closedDates: closedDatesArray,
      };
      updateEvent(
        updatedEvent,
        ["new-event", "update-event"].includes(flohFormType)
          ? "events"
          : "flohmaerkte"
      )
        .then(() => {
          setSubmitError({ isError: false, errorMessage: "" });
          revalidatePost();
          revalidateFlohmarkt();
          setSuccessfulSubmit(true);
        })
        .then(async () => {
          await sleep(2500);
          router.push(
            flohFormType === "update-flohmarkt" ||
              flohFormType === "new-flohmarkt"
              ? data.status === "approved"
                ? `/flohmaerkte/${data.id}`
                : `/flohmarkt-suggestion/${data.id}`
              : flohFormType === "update-event" || flohFormType === "new-event"
                ? `/events/${data.id}`
                : "/"
          );
        })
        .catch((error) =>
          setSubmitError({ isError: true, errorMessage: error.message })
        );
    },
    [
      imagesUrlsReady,
      userInput,
      id,
      createdAt,
      router,
      addedBy,
      flohFormType,
      closedDatesArray,
    ]
  );

  if (!user) {
    router.push("/");
  }
  if (!user || !user.name) return;
  const handleSetLatLon = (key: "lat" | "lon", value: any) => {
    setValue(key, value);
  };

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
          ["new-flohmarkt", "new-event"].includes(flohFormType)
            ? onSubmitNewFlohmarkt
            : onupdateEvent
        )}
        className="flohForm mx-auto w-full text-gray-900 lg:w-3/4 my-2 flex flex-col gap-2"
      >
        <div className="mx-auto flex w-full flex-col items-center gap-2 ">
          <div
            id="title-type"
            className="flex flex-wrap gap-4 w-full max-w-[600px] justify-center items-center bg-hh-300 rounded py-2"
          >
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
            {(flohFormType === "new-event" ||
              flohFormType === "update-event") && (
              <PostFormInput
                inputLabel="Event Type"
                inputID="type"
                required={true}
              >
                <select
                  {...register("type", { required: "Event Type is required" })}
                  defaultValue={type || "flohmarkt"}
                  required
                  className="mx  rounded border border-gray-300 bg-gray-100 bg-opacity-95 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                >
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </PostFormInput>
            )}
          </div>

          <div
            id="address-box"
            className=" w-full max-w-[600px] flex flex-wrap gap-4 border-2 border-hh-300 rounded"
          >
            <div className="bezirkBox min-w-fit w-full sm:w-2/5 flex flex-col">
              <PostFormInput
                inputLabel="Bezirk"
                inputID="bezirk"
                required={true}
              >
                <select
                  {...register("bezirk", { required: "Bezirk is required" })}
                  defaultValue={bezirk || "Altona"}
                  required
                  onChange={(e) => setBezirkInput(e.target.value as iBezirk)}
                  className="mx  rounded border border-gray-300 bg-gray-100 bg-opacity-95 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                >
                  {bezirke.map((bezirk) => (
                    <option key={bezirk} value={bezirk}>
                      {bezirk}
                    </option>
                  ))}
                </select>
              </PostFormInput>
              {bezirkInput && (
                <PostFormInput inputLabel="Stadtteil" inputID="stadtteil">
                  <select
                    {...register("stadtteil")}
                    defaultValue={
                      stadtteil || BEZIRK_TO_STADTTEILE[bezirkInput][0]
                    }
                    className="mx  rounded border border-gray-300 bg-gray-100 bg-opacity-95 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                  >
                    {BEZIRK_TO_STADTTEILE[bezirkInput].map((stadtteil) => (
                      <option key={stadtteil} value={stadtteil}>
                        {stadtteil}
                      </option>
                    ))}
                  </select>
                </PostFormInput>
              )}
              <PostFormInput inputLabel="Standort" inputID="location">
                <>
                  <input
                    {...register("location")}
                    type="text"
                    id="location"
                    name="location"
                    placeholder="(z.B. name der Apostolkirche, Schüle, etc.)"
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
                    placeholder="Stadtteil/Stadt"
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
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const { lat, lon } = await getLatLong(
                  [
                    getValues("street"),
                    getValues("number"),
                    getValues("PLZ"),
                    getValues("city"),
                  ].join(" ")
                );
                setLatLon({ lat: parseFloat(lat), lon: parseFloat(lon) });
              }}
              className="bg-green-700 hover:bg-green-600 hover:shadow-md w-full active:scale-[0.99] border-0px-8  flex rounded p-2 text-lg text-white transition-colors  duration-200 ease-in-out  focus:outline-2 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-gray-500"
            >
              Get LatLon
            </button>
            {latlon.lon && latlon.lat && (
              <LatLonSetterMap
                lat={latlon.lat}
                lon={latlon.lon}
                latlonSetter={setLatLon}
                setValue={handleSetLatLon}
              />
            )}
          </div>

          <div
            id="date-time-box"
            className="flex flex-wrap gap-4 w-full max-w-[600px] justify-center items-center bg-hh-300 rounded py-2"
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
                      className="text-base font-semibold leading-7 w-fit"
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
                      className="text-base font-semibold leading-7 w-fit"
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
            {["update-event", "new-event"].includes(flohFormType) && (
              <div className="dateBox min-w-fit flex-grow flex flex-wrap gap-2">
                <PostFormInput
                  inputLabel="EndDatum"
                  inputID="endDate"
                  required={true}
                >
                  <div className="flex flex-col flex-wrap gap-4">
                    <div className="flex gap-2 flex-wrap">
                      <input
                        defaultValue={
                          endDate
                            ? new Date(endDate).toISOString().split("T")[0]
                            : undefined
                        }
                        id={endDate + "Input"}
                        name={"endDate"}
                        type="date"
                        onChange={(e) =>
                          setValue(
                            "endDate",
                            new Date(e.target.value).getTime()
                          )
                        }
                        className="w-full block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                      />
                    </div>
                  </div>
                </PostFormInput>
                <div className="flex flex-col gap-1">
                  <PostFormInput
                    inputLabel="Closed Dates"
                    inputID="closedDates"
                    required={true}
                  >
                    <div className="flex flex-col flex-wrap gap-4">
                      <input
                        id={closedDates + "Input"}
                        name={"closedDates"}
                        type="date"
                        onChange={(e) => {
                          setClosedDates((prev) => {
                            return Array.from(
                              new Set([
                                ...prev,
                                new Date(e.target.value).getTime(),
                              ])
                            );
                          });
                        }}
                        className="w-full block rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {closedDatesArray.map((date, index) => (
                        <Button
                          variant="negative-dark"
                          size="fit"
                          fontSize="xs"
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            setClosedDates((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <span>
                            {new Date(date).toLocaleDateString("de-DE", {
                              day: "2-digit",
                              month: "short",
                              year: "2-digit",
                            })}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </PostFormInput>
                </div>
              </div>
            )}
          </div>
          <div
            id="optionalerComment-box"
            className=" w-full max-w-[600px] flex flex-wrap gap-4 border-2 border-hh-300 rounded"
          >
            <PostFormInput
              inputLabel="Optionaler Kommentar"
              inputID="optionalComment"
            >
              <textarea
                onChange={(e) => setValue("optionalComment", e.target.value)}
                id="title"
                defaultValue={optionalComment || ""}
                name="title"
                rows={6}
                className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
              />
            </PostFormInput>
          </div>
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
                  ? "bg-slate-300 hover:shadow-none"
                  : "bg-green-700 hover:bg-green-600 hover:shadow-md ml-auto"
              } active:scale-[0.99] border-0px-8  flex rounded p-2 text-lg text-white transition-colors  duration-200 ease-in-out  focus:outline-2 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-gray-500`}
            >
              {JSON.stringify(imagesUrlsReady.urls) !== JSON.stringify([image])
                ? flohFormType === "new-flohmarkt"
                  ? "Submit Flohmarkt Suggestion"
                  : flohFormType === "approve-suggestion"
                    ? "Approve Flohmarkt Suggestion"
                    : flohFormType === "update-flohmarkt"
                      ? status === "approved"
                        ? "Update Flohmarkt"
                        : "Update Flohmarkt Suggestion"
                      : flohFormType === "new-event"
                        ? "Submit Event Suggestion"
                        : flohFormType === "update-event"
                          ? "Update Event"
                          : flohFormType
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
