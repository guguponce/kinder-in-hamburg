import React from "react";

export default function TextTypeInputButton({
  setContentTextType,
  changeTo,
  buttonText,
}: {
  setContentTextType: React.Dispatch<
    React.SetStateAction<"paragraph" | "mixed" | null>
  >;
  changeTo?: "paragraph" | "mixed";
  buttonText: string;
}) {
  return (
    <button
      role="button"
      onClick={(e) => {
        e.preventDefault();
        setContentTextType((prev) =>
          changeTo === "paragraph"
            ? "paragraph"
            : changeTo === "mixed"
            ? "mixed"
            : prev === "paragraph"
            ? "mixed"
            : "paragraph"
        );
        e.currentTarget.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }}
      className="m-4 mt-0 min-w-1/3 w-fit cursor-pointer rounded-md border-2 border-gray-500 p-2 outline-offset-4 focus-within:outline-1 focus-within:outline-gray-500 hover:bg-gray-500 hover:text-white focus:outline-1 focus:outline-gray-500"
    >
      {buttonText}
    </button>
  );
}
