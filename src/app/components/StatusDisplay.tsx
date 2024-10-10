import Link from "next/link";
import React from "react";

export default function StatusDisplay({
  children,
  status,
}: {
  children: React.ReactNode;
  status: "suggested" | "pending" | "old" | "approved" | "rejected";
}) {
  return (
    <div className="flex self-center justify-center items-center rounded-md border-2 border-hh-600 bg-hh-200 mb-4 p-2">
      <div
        className={
          status === "rejected"
            ? "flex flex-col items-center bg-negative-800 text-white rounded-md p-2"
            : "flex flex-col items-center"
        }
      >
        {children}
      </div>
    </div>
  );
}

StatusDisplay.Title = function StatusTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};
StatusDisplay.Link = function StatusLink({
  status,
  href,
  children,
}: {
  children?: React.ReactNode;
  href: string;
  status: "suggested" | "pending" | "old" | "approved" | "rejected";
}) {
  return status === "approved" ? (
    <Link href={href}>Check it out!</Link>
  ) : (
    status !== "rejected" && children && (
      <>
        <small className="text-xs">(Kann immer noch geändert werden)</small>
        <Link
          href={href}
          className="px-2 py-1 bg-hh-700 hover:bg-hh-600 active:bg-hh-500 text-white rounded-md"
        >
          {children}
        </Link>
      </>
    )
  );
};
