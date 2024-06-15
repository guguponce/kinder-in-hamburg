import React from "react";
import type { TextType } from "../../utils/types";

export default function MarkUpInput({
  handleSubmitInput,
  selectedType,
  editText,
}: {
  editText?: string;
  selectedType: TextType;
  handleSubmitInput: (type: TextType, text: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  return (
    <div className="flex  flex-col rounded-sm bg-[hsla(20,24%,29%,0.1)] p-4 text-[hsla(0,4%,0%)]">
      {[
        "numbered-list",
        "points-list",
        "quote",
        "paragraph",
        "small-paragraph",
        "large-paragraph",
      ].includes(selectedType) && (
        <>
          <textarea
            className="w-full max-w-full rounded-sm px-4 py-2"
            rows={editText ? 15 : selectedType === "quote" ? 2 : 5}
            ref={textareaRef}
            defaultValue={editText ? editText : ""}
          />
          {selectedType.includes("list") && (
            <h3 className="text-lg font-semibold">
              In case of any list, start each item with a &quot;--&quot;. e.g.
              &quot;--Body&quot;
            </h3>
          )}
        </>
      )}

      {selectedType === "separator" && (
        <hr
          className="my-5 w-[1200px] max-w-full
              border-t-2 border-[rgb(0,0,0,0.5)]"
        />
      )}

      {["subtitle1", "subtitle2", "link"].includes(selectedType) && (
        <input
          type="text"
          defaultValue={editText ? editText : ""}
          className="block w-[400px] max-w-full rounded-sm px-4 py-2"
          ref={inputRef}
        />
      )}

      <button
        className="my-4 self-end rounded-md bg-[#6c5042] px-4 py-2  text-white  focus-within:bg-[hsl(20,24%,29%)]  hover:bg-[hsl(20,24%,29%)] focus:bg-[hsl(20,24%,29%)] focus-visible:bg-[hsl(20,24%,29%)] active:bg-[hsl(20,24%,39%)]"
        role="button"
        onClick={(e) => {
          e.preventDefault();
          handleSubmitInput(
            selectedType,
            selectedType === "separator"
              ? ""
              : ["subtitle1", "subtitle2", "link"].includes(selectedType)
              ? inputRef.current?.value || ""
              : textareaRef.current?.value || ""
          );
        }}
      >
        {editText ? "Modify" : "Add"}
      </button>
    </div>
  );
}
