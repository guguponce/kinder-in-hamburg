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
  | "image"
  | "igAccounts"
  | "pinnedPost";
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
    <div className="w-full p-2 lg:w-3/4">
      <div className="relative ">
        <label
          htmlFor={inputID}
          className="text-md mx-auto font-semibold leading-7 lg:w-3/4"
        >
          {inputLabel}
          {required && (
            <>
              <span className="text-red-800">*</span>
              <span className="text-sm text-red-800"> (Required)</span>
            </>
          )}
          {inputID === "tags" && (
            <span>
              (
              {`separate each tag with a "-". For example: "neck-guitar parts"`}
              )
            </span>
          )}
        </label>
        {children}
      </div>
    </div>
  );
}
