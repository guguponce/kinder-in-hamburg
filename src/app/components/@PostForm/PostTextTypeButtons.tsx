import React from "react";
import TextTypeInputButton from "./TextTypeInputButton";

export default function PostTextTypeButtons({
  contentTextType,
  setContentTextType,
}: {
  contentTextType: string | null;
  setContentTextType: React.Dispatch<
    React.SetStateAction<"paragraph" | "mixed" | null>
  >;
}) {
  return (
    <>
      {!!contentTextType ? (
        <TextTypeInputButton
          buttonText={
            contentTextType === "paragraph"
              ? "Change to Subtitles, Paragraphs, Lists..."
              : "Change to Simple Paragraphs"
          }
          setContentTextType={setContentTextType}
        />
      ) : (
        <div className="contentTypeSelection mx-auto lg:w-fit flex items-center justify-center gap-4">
          <TextTypeInputButton
            buttonText={"Simple Paragraphs"}
            setContentTextType={setContentTextType}
            changeTo="paragraph"
          />
          <TextTypeInputButton
            buttonText={"Subtitles, Paragraphs, Lists..."}
            setContentTextType={setContentTextType}
            changeTo="mixed"
          />
        </div>
      )}
    </>
  );
}
