import React from "react";
import { TextType, TypeAndText } from "../../utils/types";
import AddText from "./AddText";
import ItemBox from "./ItemTextBox";

export default function MarkUpForm({
  savedPostText,
  setSavedPostText,
}: {
  setSavedPostText: React.Dispatch<React.SetStateAction<TypeAndText[]>>;
  savedPostText: TypeAndText[];
}) {
  const onAdd = (text: TypeAndText) => {
    setSavedPostText((prev) => [...prev, text]);
  };

  const removeText = (index: number) => {
    setSavedPostText((prev) => prev.filter((_, i) => i !== index));
  };

  const editText = (index: number, text: string, type: TextType) => {
    setSavedPostText((prev) =>
      prev.map((item, i) => (i === index ? [type, text] : item))
    );
  };
  return (
    <div className=" w-full p-2 text-black ">
      <AddText onAdd={onAdd} />

      <div className="relative flex flex-col">
        <h2 className="text-lg font-semibold">
          This is how the text will be displayed:
        </h2>
        {savedPostText.map(([type, text], i) => (
          <div
            key={text + Math.random() + i}
            className={`w-full rounded-sm bg-slate-700 bg-opacity-95 px-2  py-2 text-[#e6e6e6] ${
              i === savedPostText.length - 1 ? "pb-20" : ""
            }`}
          >
            <ItemBox
              type={type}
              text={text}
              index={i}
              removeText={removeText}
              editText={editText}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
