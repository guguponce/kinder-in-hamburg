import { TEXT_TYPES } from "../../utils/types";
import MarkUpInput from "./MarkUpInput";
import type { TextType, TypeAndText } from "../../utils/types";
import React from "react";

export default function AddText({
  onAdd,
}: {
  onAdd: (text: TypeAndText) => void;
}) {
  const [selectedType, setSelectedType] = React.useState<TextType>("paragraph");
  const handleSubmitInput = (type: TextType, text: string) => {
    if (selectedType === "separator") return onAdd([selectedType, ""]);
    onAdd([selectedType, text]);

    if (selectRef.current) {
      setSelectedType("paragraph");
      selectRef.current.focus();
      selectRef.current.value = "paragraph";
    }
  };
  const selectRef = React.useRef<HTMLSelectElement>(null);
  return (
    <div>
      <hr className="mb-2 mt-6 border-t-2" />

      <h1 className="text-lg font-bold">Add a new part of the text:</h1>
      <div className="mt-4 flex flex-col gap-2 md:mt-0 md:flex-row md:gap-8">
        <select
          ref={selectRef}
          className="h-fit rounded-md border-2 border-gray-500 p-2 outline-offset-4 focus:bg-slate-200 focus:shadow-xl focus:outline-2 focus:outline-gray-500 focus-visible:bg-slate-200 focus-visible:shadow-xl focus-visible:outline-2 focus-visible:outline-gray-500 "
          defaultValue={selectedType}
          onChange={(e) => setSelectedType(e.target.value as TextType)}
        >
          {TEXT_TYPES.map((selectedType, i) => (
            <option
              key={selectedType}
              className={`${i % 2 ? "" : "bg-slate-100"}`}
              value={selectedType}
            >
              {selectedType}
            </option>
          ))}
        </select>
        <div className="w-full">
          <MarkUpInput
            selectedType={selectedType}
            handleSubmitInput={handleSubmitInput}
          />
        </div>
      </div>
      <hr className="my-6  border-t-2" />
    </div>
  );
}
