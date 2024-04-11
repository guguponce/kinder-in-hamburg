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
        <pre style={{ overflowWrap: "break-word" }} className=" text-wrap ">
          {text}
        </pre>
      ) : type === "subtitle1" ? (
        <h2 className="my-6 text-lg font-bold">{text}</h2>
      ) : type === "subtitle2" ? (
        <h2 className="my-4 text-lg font-semibold">{text}</h2>
      ) : type === "quote" ? (
        <div className="quote mx-auto w-[80%]">
          {" "}
          <hr className="my-4 border-[hsla(0,0%,30%,1)]" />
          <h1
            className="text-center text-lg italic"
            style={{ fontFamily: "Courier, monospace" }}
          >
            &quot;{text}&quot;
          </h1>
          <hr className="my-4 border-[hsla(0,0%,30%,1)]" />
        </div>
      ) : type === "small-paragraph" ? (
        <pre style={{ overflowWrap: "break-word" }} className=" text-wrap ">
          {text}
        </pre>
      ) : type === "large-paragraph" ? (
        <pre style={{ overflowWrap: "break-word" }} className=" text-wrap ">
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
          className="text-purple-500 underline outline-offset-2 hover:text-purple-600 focus:border-0 focus:outline-2 focus:outline-purple-600 active:text-purple-400"
          target="_blank"
        >
          {text}
        </Link>
      ) : type === "numbered-list" ? (
        <ol className="ml-6 list-decimal">
          {text
            .split("-")
            .filter(Boolean)
            .map((line) => (
              <li key={line + Math.random()}>{line.trim()}</li>
            ))}
        </ol>
      ) : type === "points-list" ? (
        <ul className="ml-6 list-disc">
          {text
            .split("-")
            .filter(Boolean)
            .map((line) => (
              <li key={line + Math.random()}>{line.trim()}</li>
            ))}
        </ul>
      ) : null}
    </>
  );
}
