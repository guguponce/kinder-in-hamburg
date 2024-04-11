import { iSessionUser } from "@app/utils/types";
import React from "react";
import PostFormInput from "../@PostForm/PostFormInput";

export default function UserInputBox({
  setUserInput,
  userInput,
}: {
  setUserInput: React.Dispatch<React.SetStateAction<iSessionUser>>;
  userInput: iSessionUser;
}) {
  const keys: ("name" | "email")[] = ["name", "email"];
  return (
    <section className="userInputBox w-full max-w-[800px] mx-auto justify-center flex flex-wrap items-center gap-2 text-hh-950 mb-2">
      {keys.map((k) => (
        <div className="w-[calc(50%-1rem)] min-w-fit max-w-[300px]" key={k}>
          <PostFormInput
            inputLabel={k === "name" ? "Name" : "Email"}
            inputID={k}
            required={true}
          >
            {!userInput[k] ? (
              <input
                type={k === "email" ? "email" : "text"}
                id={k}
                className="w-full rounded border border-hh-300 bg-hh-100 bg-opacity-60 px-3 py-1 text-base font-semibold leading-8 text-hh-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700"
                name={k}
                value={userInput[k] || ""}
                onChange={(e) =>
                  setUserInput((prev) => ({ ...prev, [k]: e.target.value }))
                }
              />
            ) : (
              <h3 className="w-full rounded border-hh-400 border-2  px-3 py-1 text-base font-semibold leading-8 text-hh-900 outline-none transition-colors duration-200 ease-in-out focus:border-hh-600 focus:bg-white focus:ring-2 focus:ring-hh-700">
                {userInput[k]}
              </h3>
            )}
          </PostFormInput>
        </div>
      ))}
    </section>
  );
}
