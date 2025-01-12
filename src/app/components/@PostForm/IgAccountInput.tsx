import { iIgAccount } from "@app/utils/types";
import React, { useState } from "react";

export default function IgAccountInput({
  handleAddIgAccount,
}: {
  handleAddIgAccount: (account: iIgAccount) => void;
}) {
  const [igDescription, setigDescription] = useState<string>("");
  const [igDescriptionError, setigDescriptionError] = useState<boolean>(false);
  const [igName, setIgName] = useState<string>("");
  const [igNameError, setIgNameError] = useState<boolean>(false);

  const handleAdd = () => {
    if (igName === "") {
      setIgNameError(true);
    }
    if (igName === "") return;
    handleAddIgAccount({ name: igName, description: igDescription });
    setigDescription("");
    setIgName("");
    setigDescriptionError(false);
    setIgNameError(false);
  };
  return (
    <div className="flex items-center">
      <div className="flex flex-wrap gap-4 p-2">
        <div className="flex flex-col">
          <label
            htmlFor="igName"
            className="text-base font-semibold leading-7 text-hh-800"
          >
            Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="igName"
              name="igName"
              value={igName}
              onChange={(e) => setIgName(e.target.value)}
              onBlur={() => {
                if (igName === "" && igDescription !== "") {
                  setIgNameError(true);
                } else {
                  setIgNameError(false);
                }
              }}
              className={`w-40 p-2 mt-1 rounded-md text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-500`}
            />
            <span className="absulute right-full">@</span>
          </div>
          {igNameError && (
            <p className="text-negative-800">Instagram name is required</p>
          )}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="igDescription"
            className="text-base font-semibold leading-7"
          >
            Beschreibung
          </label>

          <input
            type="text"
            id="igDescription"
            name="igDescription"
            value={igDescription}
            onChange={(e) => setigDescription(e.target.value)}
            onBlur={() => {
              if (igName !== "") {
                setigDescriptionError(true);
              } else {
                setigDescriptionError(false);
              }
            }}
            className={`w-60 p-2 mt-1 rounded-md text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-500`}
          />
        </div>
      </div>
      <button
        role="button"
        className="p-2 h-8 flex self-end my-4 justify-center items-center w-8 rounded-md font-semibold border-2 bg-hh-800 text-hh-100 hover:bg-hh-800 active:bg-hh-800 border-hh-800"
        onClick={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        +
      </button>
    </div>
  );
}
