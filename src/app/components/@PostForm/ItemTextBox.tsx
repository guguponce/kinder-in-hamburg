import React from "react";
import DeleteSVG from "../../assets/svg/DeleteSVG";
import { TextType } from "../../utils/types";
import DisplayTypeText from "./DisplayTypeText";
import MarkUpInput from "./MarkUpInput";

export default function ItemBox({
  type,
  text,
  index,
  removeText,
  editText,
}: {
  editText: (index: number, text: string, type: TextType) => void;
  type: TextType;
  text: string;
  index: number;
  removeText: (index: number) => void;
}) {
  const [editItem, setEditItem] = React.useState(false);
  const handleEdit = (type: TextType, text: string) => {
    editText(index, text, type);
    setEditItem(false);
  };
  return (
    <>
      {editItem && (
        <div className="relative my-4 w-full bg-black bg-opacity-20">
          <MarkUpInput
            selectedType={type}
            editText={text}
            handleSubmitInput={handleEdit}
          />
        </div>
      )}
      <div className="">
        <div className="relative float-right  my-2 ml-2 flex min-h-4  min-w-32 flex-col items-center gap-2 rounded-sm border-2 border-slate-100">
          <p className=" ml-2 w-32 text-sm font-bold capitalize ">{type}</p>
          <div className={`editButtons flex w-fit items-end gap-2`}>
            <button
              className="h-12 w-fit min-w-12 rounded-md bg-red-800 px-4 py-2 text-white"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                removeText(index);
              }}
            >
              <DeleteSVG />
            </button>
            <button
              className={`${editItem ? "mt-6" : "mt-2"}  h-12 w-fit min-w-12
              rounded-md bg-green-800 px-4 py-2 text-white`}
              disabled={editItem}
              role="button"
              onClick={(e) => {
                e.preventDefault();
                setEditItem((prev) => (prev ? false : true));
              }}
            >
              {editItem ? "Close ×" : "Edit"}
            </button>
          </div>
        </div>
        <div className="">
          <DisplayTypeText type={type} text={text} />
        </div>
      </div>
    </>
  );
}
