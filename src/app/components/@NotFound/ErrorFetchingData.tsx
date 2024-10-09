import React from "react";
import ErrorContainer from "./ErrorContainer";

interface iErrorFetchingData {
  type: string;
  linkText?: string;
  href?: string;
}

export default function ErrorFetchingData({
  type,
  linkText,
  href = "/",
}: iErrorFetchingData) {
  return (
    <ErrorContainer as="main">
      <ErrorContainer.Title>
        Bei der Suche nach {type} ist ein Fehler aufgetreten
      </ErrorContainer.Title>
      <ErrorContainer.Text>
        Bitte versuch es später noch einmal
      </ErrorContainer.Text>

      {linkText && (
        <ErrorContainer.Link href={href}>{linkText}</ErrorContainer.Link>
      )}
    </ErrorContainer>
  );
}
