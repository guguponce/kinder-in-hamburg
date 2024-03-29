import React from "react";
import { TypeAndText } from "../../utils/types";
import DisplayTypeText from "./DisplayTypeText";

export default function DisplayDraft({
  savedPostText,
}: {
  savedPostText: TypeAndText[];
}) {
  return (
    <>
      <h2 className="text-lg font-semibold">
        This is how the text will be displayed:
      </h2>
      <div
        id="markup-display"
        className="mb-4 min-h-8 w-full rounded-sm bg-slate-700 p-6 text-white"
      >
        {savedPostText.map(([type, text]) => (
          <React.Fragment key={text + Math.random()}>
            <DisplayTypeText type={type} text={text} />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
