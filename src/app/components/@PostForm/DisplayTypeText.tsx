import React from "react";
import { TextType } from "../../utils/types";
import Link from "next/link";

const formatText = (text: string) => {
  // Regular expressions to match the formatting tags and their content
  const regex =
    /<b>(.*?)<\/?b>|<sb>(.*?)<\/?sb>|<i>(.*?)<\/?i>|<u>(.*?)<\/?u>|<upper>(.*?)<\/?upper>|<link>(.*?)<\/?link>|<h3>(.*?)<\/?h3>|<h2>(.*?)<\/?h2>|<attribution>(.*?)<\/?attribution>|<email>(.*?)<\/?email>/g;

  let formattedText = [];
  let lastIndex = 0;

  // Iterate through the matches and replace them with React components
  text.replace(
    regex,
    (
      match,
      boldText,
      semiboldText,
      italicText,
      underlinedText,
      upperText,
      linkText,
      h3,
      h2,
      attributionText,
      email,
      index
    ) => {
      // Push the text before the match
      if (index > lastIndex) {
        formattedText.push(text.slice(lastIndex, index));
      }

      // Push the formatted part based on the match
      if (boldText) {
        formattedText.push(
          <strong className="font-extrabold" key={index}>
            {boldText}
          </strong>
        );
      } else if (semiboldText) {
        formattedText.push(
          <span className="font-semibold" key={index}>
            {semiboldText}
          </span>
        );
      } else if (italicText) {
        formattedText.push(<em key={index}>{italicText}</em>);
      } else if (underlinedText) {
        formattedText.push(<u key={index}>{underlinedText}</u>);
      } else if (upperText) {
        formattedText.push(
          <span className="uppercase" key={index}>
            {underlinedText}
          </span>
        );
      } else if (h3) {
        formattedText.push(
          <span className="text-lg font-semibold" key={index}>
            {h3}
          </span>
        );
      } else if (h2) {
        formattedText.push(
          <span className="text-xl font-bold" key={index}>
            {h2}
          </span>
        );
      } else if (attributionText) {
        formattedText.push(<></>);
      } else if (linkText) {
        formattedText.push(
          <a
            className="italic underline text-hh-800 break-words"
            key={index}
            href={linkText}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
          </a>
        );
      } else if (email) {
        formattedText.push(
          <a
            className="italic underline text-hh-700 break-words"
            key={index}
            href={`mailto:${email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {email}
          </a>
        );
      }

      lastIndex = index + match.length; // Update the last index

      return match; // Continue processing other matches
    }
  );

  // Push any remaining text after the last match
  if (lastIndex < text.length) {
    formattedText.push(text.slice(lastIndex));
  }

  return formattedText;
};
const CustomPre = ({ text }: { text: string }) => {
  return (
    <pre
      style={{
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      }}
      key={text}
      className="text-wrap py-1 max-w-full w-full"
    >
      {formatText(text)}
    </pre>
  );
};
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
        <CustomPre text={text} />
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
          key={text}
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
          key={text}
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
          className="break-words block w-full text-hh-800 underline outline-offset-2 hover:text-hh-600 focus:border-0 focus:outline-2 focus:outline-hh-600 active:text-hh-700"
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
