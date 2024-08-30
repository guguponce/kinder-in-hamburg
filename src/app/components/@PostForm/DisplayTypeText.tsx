import React from "react";
import { TextType } from "../../utils/types";
import Link from "next/link";

export default function DisplayTypeText({
  type = "paragraph",
  text,
}: {
  type: TextType;
  text: string;
}) {
  return (
    <>
      {type === "paragraph" ? (
        <pre
          style={{
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
          className=" text-wrap py-1 max-w-full w-full"
        >
          {text}
        </pre>
      ) : type === "subtitle1" ? (
        <h2
          style={{
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
          className="mt-4 text-2xl font-bold"
        >
          {text}
        </h2>
      ) : type === "subtitle2" ? (
        <h2
          style={{
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
          className="mt-2 text-lg font-semibold"
        >
          {text}
        </h2>
      ) : type === "quote" ? (
        <div className="quote mx-auto w-[80%]">
          <hr className="my-4 border-[hsla(0,0%,30%,1)]" />
          <h3
            style={{
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              fontFamily: "Courier, monospace",
            }}
            className="text-center text-lg italic"
          >
            &quot;{text}&quot;
          </h3>
          <hr className="my-4 border-[hsla(0,0%,30%,1)]" />
        </div>
      ) : type === "small-paragraph" ? (
        <pre
          style={{
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
          className="text-sm  text-wrap py-1 max-w-full w-full"
        >
          {text}
        </pre>
      ) : type === "large-paragraph" ? (
        <pre
          style={{
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
          className="text-xl font-semibold my-1 text-wrap py-1 max-w-full w-full"
        >
          {text}
        </pre>
      ) : type === "separator" ? (
        <hr
          className="my-5 w-full  
                border-t-2 border-[rgb(0,0,0,0.5)]"
        />
      ) : type === "link" ? (
        <Link
          passHref={true}
          href={text}
          style={{
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
          className="break-words block w-full text-hh-500 underline outline-offset-2 hover:text-hh-600 focus:border-0 focus:outline-2 focus:outline-hh-600 active:text-hh-400"
          target="_blank"
        >
          {text}
        </Link>
      ) : type === "numbered-list" ? (
        <ol className="ml-6 list-decimal">
          {text
            .split("--")
            .filter(Boolean)
            .map((line) => (
              <li key={line + Math.random()}>{line.trim()}</li>
            ))}
        </ol>
      ) : type === "points-list" ? (
        <ul className="ml-6 list-disc">
          {text
            .split("--")
            .filter(Boolean)
            .map((line) => (
              <li key={line + Math.random()}>{line.trim()}</li>
            ))}
        </ul>
      ) : null}
    </>
  );
}
