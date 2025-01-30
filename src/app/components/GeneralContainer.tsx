import { cn } from "@app/utils/functions";
import React from "react";

type GeneralContainerProps = {
  type?: "div" | "section" | "article" | "main";
  children: React.ReactNode;
  classname?: string;
};

const GeneralContainer: React.FC<GeneralContainerProps> = ({
  type = "div",
  children,
  classname,
}) => {
  const Tag = type; // Dynamic element assignment based on the "type" prop

  return (
    <Tag
      className={cn(
        "w-full p-2 lg:p-4 rounded lg:rounded-lg flex flex-col items-center bg-hh-200 bg-opacity-50 backdrop-blur-sm",
        classname
      )}
    >
      {children}
    </Tag>
  );
};

export default GeneralContainer;
