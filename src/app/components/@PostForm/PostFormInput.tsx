import React from "react";

type inputLabelType =
  | "title"
  | "text"
  | "categories"
  | "tags"
  | "link"
  | "bezirk"
  | "address"
  | "email"
  | "name"
  | "minAge"
  | "maxAge"
  | "email"
  | "image"
  | "igAccounts"
  | "pinnedPost"
  | "free"
  | "date"
  | "time"
  | "approved"
  | "optionalComment"
  | "location"
  | "stadtteil";
interface PostFormInputProps {
  inputID: inputLabelType;
  inputLabel: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function PostFormInput({
  inputLabel,
  inputID,
  children,
  required,
}: PostFormInputProps) {
  return (
    <div className="w-full max-w-[600px] p-2 rounded bg-hh-100 bg-opacity-20">
      <div className="relative flex flex-col">
        <label
          htmlFor={inputID}
          className="text-md font-semibold leading-7 w-fit text-hh-800"
        >
          {inputLabel}
          {required && (
            <>
              <span className="text-negative-800">*</span>
              <span className="text-sm text-negative-800"> (Required)</span>
            </>
          )}
        </label>
        {children}
      </div>
    </div>
  );
}
