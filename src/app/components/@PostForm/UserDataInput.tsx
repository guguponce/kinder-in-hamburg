import { iSessionUser } from "@app/utils/types";
import React from "react";
import PostFormInput from "./PostFormInput";

export default function UserDataInput({
  userData,
  setUserData,
}: {
  userData: iSessionUser;
  setUserData: React.Dispatch<React.SetStateAction<iSessionUser>>;
}) {
  const [userInput, setUserInput] = React.useState<iSessionUser>(userData);
  const missingData = Object.entries(userInput).filter(
    ([k, v]) => !v && ["email", "name"].includes(k)
  );
  return (
    <div className="flex flex-col">
      <h2>
        We still need your{" "}
        {missingData.length === 2 ? "name and email" : missingData[0][0]}
      </h2>
      {missingData.map(([key]) => (
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
            value={userInput[key as "email" | "name"] || ""}
            onChange={(e) =>
              setUserInput({ ...userInput, [key]: e.target.value })
            }
            className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-gray-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
          />
        </PostFormInput>
      ))}
      <button
        onClick={() => setUserData(userInput)}
        className="bg-hh-800 text-white rounded-md p-2"
      >
        Submit
      </button>
    </div>
  );
}
