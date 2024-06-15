"use client";
import { iBezirk, iSessionUser, iSpielplatz } from "@app/utils/types";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import AdminClientComponents from "@app/providers/AdminClientComponents";
import UserInputBox from "@app/components/@FlohForm/UserInputBox";
import PostFormInput from "@app/components/@PostForm/PostFormInput";

const LatLonSetterMap = dynamic(() => import("./LatLonSetterMap"), {
  ssr: false,
});

import {
  BEZIRK_TO_STADTTEILE,
  addressPartsArray,
  bezirke,
} from "@app/utils/constants";
import {
  spielgeraeteDisplay,
  ausruestungList as ausruestungDisplay,
  spType,
} from "@app/utils/constants";
import { submitNewSpielplatz, submitUpdateSpielplatz } from "./functions";
import { getLatLong, sleep } from "@app/utils/functions";
import ScrollableContainer from "@app/components/ScrollableContainer";
import dynamic from "next/dynamic";
import { revalidateSpielplatz } from "@app/api/spActions";

interface iSpielplatzFormProps {
  spielplatzForm: Partial<iSpielplatz>;
  user: iSessionUser;
  children?: React.ReactNode;
  spielplatzFormType:
    | "new-spielplatz"
    | "update-spielplatz"
    | "update-suggestion";
  spielplatzStoredImages?: string[];
}

export default function SpielplatzForm({
  spielplatzStoredImages,
  spielplatzForm: {
    id,
    createdAt,
    title,
    text,
    type,
    tags,
    spielgeraete,
    ausruestung,
    status,
    pinnedSpielplatz,
    minAge,
    maxAge,
    image,
    bezirk,
    stadtteil,
    address,
    lat,
    lon,
    addedBy,
  },
  user,
  spielplatzFormType,
}: iSpielplatzFormProps) {
  const newID = useRef(new Date().getTime());
  const router = useRouter();
  const [imagesUrlsReady, setImagesUrlsReady] = useState<{
    ready: boolean;
    urls: string[];
  }>({ ready: true, urls: [] });
  const [successfulSubmit, setSuccessfulSubmit] = useState<boolean>(false);

  const [userInput, setUserInput] = useState<iSessionUser>(addedBy || user);
  const [submitError, setSubmitError] = useState<{
    isError: boolean;
    errorMessage: string;
  }>({ isError: false, errorMessage: "" });
  const [bezirkInput, setBezirkInput] = useState<iBezirk>(bezirk || "Altona");
  const [spielgaereteList, setSpielgeraeteList] = useState<string[]>(
    spielgeraete || []
  );
  const [ausruestungList, setAusruestungList] = useState<string[]>(
    ausruestung || []
  );
  const [typeList, setTypeList] = useState<string[]>(type || ["outdoor"]);
  const [latlon, setLatLon] = useState({ lat, lon });
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitSuccessful, isDirty, isSubmitting, isLoading },
  } = useForm({
    defaultValues: {
      street: address?.street || "",
      number: address?.number || "",
      PLZ: address?.PLZ || "",
      city: address?.city || "",
      id: id || newID.current,
      createdAt: createdAt || newID.current,
      title: title,
      text: text,
      type: type || ["outdoor"],
      tags: tags?.join(" * ") || "",
      spielgeraete: spielgeraete,
      ausruestung: ausruestung,
      status: status || "pending",
      pinnedSpielplatz: !!pinnedSpielplatz,
      minAge: minAge,
      maxAge: maxAge,
      image: spielplatzStoredImages,
      bezirk: bezirk,
      stadtteil: stadtteil,
      address: address,
      lat: lat,
      lon: lon,
      addedBy: addedBy || user,
    },
  });

  const onSubmitNewSpielplatz = (data: FieldValues) => {
    // if (!imagesUrlsReady.ready) return alert("Images are not ready yet");
    // if (!userInput.email || !userInput.name)
    //   return alert("Your name and email are required");
    if (!data.street || !data.city || !data.PLZ)
      return alert("Please provide the address of the Spielplatz");

    if (spielgaereteList.length === 0)
      return alert("Please select at least one Spielgerät");
    if (typeList.length === 0)
      return alert("Please select at least one Type of Spielplatz");
    submitNewSpielplatz(
      data,
      spielgaereteList,
      ausruestungList,
      typeList,
      newID.current
    )
      .then(() => {
        setSubmitError({ isError: false, errorMessage: "" });
        setSuccessfulSubmit(true);
      })
      // .then(() => {
      //   deleteUnusedFlohmaerkteImages();
      // })
      .then(async () => {
        sleep(1000);
        router.push(`/update-spielplatz/${data.id}`);
      })
      .catch((error) =>
        setSubmitError({ isError: true, errorMessage: error.message })
      );
  };

  const onSubmitUpdateSpielplatz = async (data: FieldValues) => {
    // if (!imagesUrlsReady.ready) return alert("Images are not ready yet");
    // if (!userInput.email || !userInput.name)
    //   return alert("Your name and email are required");

    if (!data.street || !data.city || !data.PLZ)
      return alert("Please provide the address of the Spielplatz");

    if (spielgaereteList.length === 0)
      return alert("Please select at least one Spielgerät");
    if (typeList.length === 0)
      return alert("Please select at least one Type of Spielplatz");
    submitUpdateSpielplatz(data, spielgaereteList, ausruestungList, typeList)
      .then(() => {
        setSubmitError({ isError: false, errorMessage: "" });
        setSuccessfulSubmit(true);
        revalidateSpielplatz();
      })
      // .then(() => {
      //   deleteUnusedFlohmaerkteImages();
      // })
      .then(async () => {
        sleep(1000);
        router.push(`/spielplaetze/`);
      })
      .catch((error) =>
        setSubmitError({ isError: true, errorMessage: error.message })
      );
  };
  useEffect(() => {}, [bezirkInput, getValues]);
  if (!user) router.push("/");
  if (!user.email || !user.name) return;
  const handleSetLatLon = (key: "lat" | "lon", value: any) => {
    setValue(key, value);
  };
  return (
    <section id="spielplatz-form-container" className="w-full">
      <h2 className="text-center text-hh-800 my-4">
        (ID: {id || newID.current})
      </h2>
      <UserInputBox setUserInput={setUserInput} userInput={userInput} />
      {!!spielplatzStoredImages?.length && (
        <div id="images-box" className="w-full">
          <h2 className="text-lg font-bold text-center text-hh-800">Images</h2>
          <ScrollableContainer>
            {spielplatzStoredImages?.map((img) => (
              <div className="w-full h-[300px]" key={img}>
                <img
                  loading="lazy"
                  src={img}
                  alt="spielplatz image"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </ScrollableContainer>
        </div>
      )}
      <form
        onSubmit={handleSubmit((data) =>
          spielplatzFormType === "new-spielplatz"
            ? onSubmitNewSpielplatz(data)
            : spielplatzFormType === "update-spielplatz"
            ? onSubmitUpdateSpielplatz(data)
            : () => {
                return data;
              }
        )}
        className="spielplatzForm mx-auto w-full text-gray-900 lg:w-3/4 my-2 flex flex-col gap-2"
      >
        <div className="mx-auto flex w-full flex-col items-center gap-2 ">
          <article
            id="date-time-box"
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
                  <p className="text-negative-500">{errors.title!.message}</p>
                )}
              </>
            </PostFormInput>
          </article>

          <article
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
                  onChange={(e) => {
                    setBezirkInput(e.target.value as iBezirk);
                    setValue(
                      "stadtteil",
                      BEZIRK_TO_STADTTEILE[e.target.value as iBezirk][0]
                    );
                  }}
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
          </article>
          <article
            id="spielgeraete-ausruestung-box"
            className="flex flex-col p-2 gap-4 w-[full] justify-center items-center bg-hh-300 rounded py-2"
          >
            <div
              id="spielgeraete-box"
              className="flex flex-wrap justify-center gap-2 sm:gap-4"
            >
              <h3 className="font-bold text-lg">Spielgeräte</h3>
              <div className="w-full flex flex-wrap justify-center sm:flex-wrap gap-2 rounded items-stretch">
                {Object.entries(spielgeraeteDisplay.arrays).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className=" w-full sm:w-1/3 min-w-[150px] border rounded border-gray-300"
                    >
                      <h4 className="rounded-[4px_4px_0_0] border  capitalize break-words border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700">
                        {key}
                      </h4>
                      <div className="py-1 px-2 w-full">
                        {value.map((item) => (
                          <label
                            key={item}
                            className="flex capitalize break-words text-hh-800 cursor-pointer hover:bg-white hover:bg-opacity-20 hover:font-semibold transition-all"
                          >
                            <input
                              type="checkbox"
                              value={item}
                              defaultChecked={spielgaereteList.includes(
                                item.toLowerCase()
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSpielgeraeteList([
                                    ...spielgaereteList,
                                    item,
                                  ]);
                                } else {
                                  setSpielgeraeteList(
                                    spielgaereteList.filter(
                                      (cat) => cat !== item
                                    )
                                  );
                                }
                              }}
                              className="mr-2 min-w-4 min-h-4"
                            />
                            {item}
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className=" w-full min-w-[200px] flex flex-wrap justify-center gap-2">
                {spielgeraeteDisplay.singles.map((key) => (
                  <label
                    key={key}
                    className="sm:w-1/3 min-w-[150px]  cursor-pointer hover:bg-white hover:bg-opacity-20 hover:font-semibold rounded flex items-center capitalize break-words border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 h-fit text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                  >
                    <input
                      type="checkbox"
                      value={key}
                      defaultChecked={spielgaereteList.includes(
                        key.toLowerCase()
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSpielgeraeteList([...spielgaereteList, key]);
                        } else {
                          setSpielgeraeteList(
                            spielgaereteList.filter((cat) => cat !== key)
                          );
                        }
                      }}
                      className="mr-2"
                    />
                    {key}
                  </label>
                ))}
              </div>
              <div className="sm:w-1/3 min-w-[150px] flex flex-col sm:flex-wrap gap-2 rounded items-center bg-hh-100 bg-opacity-15">
                <h4 className=" w-full rounded-[4px_4px_0_0] border  capitalize break-words border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700">
                  Sport
                </h4>
                <div className="py-1 px-2  w-full">
                  {spielgeraeteDisplay.sport.map((item) => (
                    <label
                      key={item}
                      className="flex capitalize  cursor-pointer hover:bg-white hover:bg-opacity-20 hover:font-semibold transition-all rounded break-words text-hh-800"
                    >
                      <input
                        type="checkbox"
                        value={item}
                        defaultChecked={spielgaereteList.includes(
                          item.toLowerCase()
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSpielgeraeteList([...spielgaereteList, item]);
                          } else {
                            setSpielgeraeteList(
                              spielgaereteList.filter((cat) => cat !== item)
                            );
                          }
                        }}
                        className="mr-2 min-w-4 min-h-4"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <span className="block h-[2px] w-full bg-hh-700 " />
            <div
              id="ausruestung-box"
              className="flex flex-col items-center gap-2 sm:gap-4"
            >
              <h3 className="font-bold text-lg">Ausrüstungen</h3>
              <div className="w-full flex flex-wrap justify-center gap-2">
                {ausruestungDisplay.map((key) => (
                  <label
                    key={key}
                    className="w-full sm:w-1/3 min-w-[250px] cursor-pointer hover:bg-white hover:bg-opacity-20 hover:font-semibold rounded flex items-center capitalize break-words border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 h-fit text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                  >
                    <input
                      type="checkbox"
                      value={key}
                      defaultChecked={ausruestungList.includes(
                        key.toLowerCase()
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAusruestungList([...ausruestungList, key]);
                        } else {
                          setAusruestungList(
                            ausruestungList.filter((cat) => cat !== key)
                          );
                        }
                      }}
                      className="mr-2"
                    />
                    {key}
                  </label>
                ))}
              </div>
            </div>

            <span className="block h-[2px] w-full bg-hh-700 " />
            <div
              id="type-box"
              className="flex flex-col items-center gap-2 sm:gap-4"
            >
              <h3 className="font-bold text-lg">Art von Spielplatz</h3>
              <div className="w-full flex flex-wrap justify-center gap-2">
                {spType.map((key) => (
                  <label
                    key={key}
                    className="w-full sm:w-1/3 sm:min-w-[250px] min-w-[150px] cursor-pointer hover:bg-white hover:bg-opacity-20 hover:font-semibold rounded flex items-center capitalize break-words border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 h-fit text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                  >
                    <input
                      type="checkbox"
                      value={key}
                      defaultChecked={
                        !!typeList.length
                          ? typeList.includes(key)
                          : key === "outdoor"
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTypeList([...typeList, key]);
                        } else {
                          setTypeList(typeList.filter((cat) => cat !== key));
                        }
                      }}
                      className="mr-2"
                    />
                    {key}
                  </label>
                ))}
              </div>
            </div>
          </article>
          <article
            id="optionalerComment-box"
            className=" w-full max-w-[600px] flex flex-wrap gap-4 border-2 border-hh-300 rounded"
          >
            <PostFormInput inputLabel="Beschreibung" inputID="optionalComment">
              <textarea
                onChange={(e) => setValue("text", e.target.value)}
                id="title"
                defaultValue={text || ""}
                name="title"
                rows={6}
                className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
              />
            </PostFormInput>
          </article>

          <article
            id="age-box"
            className="flex flex-wrap gap-4 w-full max-w-[600px] justify-center items-center bg-hh-300 rounded py-2"
          >
            <div className="w-24">
              <PostFormInput inputLabel="Min Alter" inputID="minAge">
                <input
                  {...register("minAge")}
                  type="number"
                  id="minAge"
                  name="minAge"
                  min={0}
                  max={18}
                  className="w-20 rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                />
              </PostFormInput>
            </div>{" "}
            <div className="w-24">
              <PostFormInput inputLabel="Max Alter" inputID="maxAge">
                <input
                  {...register("maxAge")}
                  type="number"
                  id="maxAge"
                  name="maxAge"
                  min={0}
                  max={99}
                  className="w-20 rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                />
              </PostFormInput>{" "}
            </div>
          </article>

          <PostFormInput inputLabel="Pinned Post?" inputID="pinnedPost">
            <select
              {...register("pinnedSpielplatz")}
              defaultValue={pinnedSpielplatz ? "true" : "false"}
              defaultChecked={pinnedSpielplatz}
              className="mx-4  rounded border border-gray-300 bg-gray-100 bg-opacity-95 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
            >
              <option value="false">False</option>
              <option value="true">True</option>
            </select>
          </PostFormInput>
          <AdminClientComponents>
            <PostFormInput
              inputLabel='Tags (separate each tag with a "*". For example: "spielplatz * pferde")'
              inputID="tags"
            >
              <>
                <input
                  {...register("tags")}
                  defaultValue={tags?.join(" * ") || ""}
                  id="tags"
                  name="tags"
                  placeholder="wasser * sand * spielplatz"
                  className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                />
                {errors.tags && (
                  <p className="text-negative-500">{`${errors.tags.message}`}</p>
                )}
              </>
            </PostFormInput>
          </AdminClientComponents>
          <button
            type="submit"
            disabled={successfulSubmit || isSubmitting || isLoading}
            className={`${
              successfulSubmit
                ? " bg-slate-300 hover:shadow-none"
                : "bg-green-700 hover:bg-green-600 hover:shadow-md ml-auto"
            } active:scale-[0.99] border-0px-8  flex rounded p-2 text-lg text-white transition-colors  duration-200 ease-in-out  focus:outline-2 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-gray-500`}
          >
            {
              //   JSON.stringify(imagesUrlsReady.urls) !== JSON.stringify([image])
              //     ?
              spielplatzFormType === "new-spielplatz"
                ? "Submit Spielplatz Suggestion"
                : status === "approved"
                ? spielplatzFormType === "update-spielplatz"
                  ? "Update Spielplatz"
                  : "Approve Spielplatz"
                : "Update Spielplatz Suggestion"
              // : "Done"
            }
          </button>
          {submitError.isError && (
            <p className="mt-4 rounded border-4 border-negative-700 p-4 font-semibold text-negative-700">{`There was an error while submitting the Spielplatz. Error message: ${submitError.errorMessage}`}</p>
          )}
        </div>
      </form>
    </section>
  );
}
