import { iPost } from "@app/utils/types";
import React from "react";
import DisplayTypeText from "./@PostForm/DisplayTypeText";
import Link from "next/link";
import DeletePostButton from "./DeleteButton";
import DataDisplay from "./SuggestedDataDisplay";

export default function MinimalPostDisplay({
  post: { title, text, tags, id, addedBy },
}: {
  post: iPost;
}) {
  return (
    <article className="rounded-md p-4 flex flex-col w-full">
      <DataDisplay keyName={"Title"}>
        <h2 className="font-semibold">{title}</h2>
      </DataDisplay>
      <DataDisplay keyName={"Text"}>
        <>
          {text.map(([type, text]) => (
            <React.Fragment key={text}>
              <DisplayTypeText type={type} text={text} />
            </React.Fragment>
          ))}
        </>
      </DataDisplay>

      {tags && (
        <DataDisplay keyName={"Tags"}>
          <div className="flex flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="bg-hh-300 px-2 rounded-md m-1">
                {tag}
              </span>
            ))}
          </div>
        </DataDisplay>
      )}

      <div className="flex justify-between items-end mt-2">
        <div className="flex gap-4 flex-wrap items-center">
          <Link
            className={`rounded bg-hh-500 px-2 md:py-1 py-2 font-bold text-white hover:bg-hh-700 `}
            href={`/posts-approval/${id}`}
          >
            Check Suggestion
          </Link>
          <DeletePostButton
            type="post"
            size="small"
            id={id}
            title={title}
            deleteFrom="suggested"
          />
        </div>
        <small className="self-end text-xs text-hh-500">
          suggested by: {addedBy.name} - {addedBy.email}
        </small>
      </div>
    </article>
  );
}
