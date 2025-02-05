import Link from "next/link";
import React from "react";
import PostLogo from "../@Icons/@PostLogo/PostLogo";
import { iIgAccount } from "@app/utils/types";

interface iLinksBox {
  igAccounts?: iIgAccount[];
  link?: string;
}
export default function LinksBox({ igAccounts, link }: iLinksBox) {
  return (
    <section
      id="links-box"
      className="flex-grow px-4 bg-hh-200 bg-opacity-40 rounded p-4 shadow"
    >
      <h2 className="text-lg font-semibold">Links</h2>
      {!!igAccounts && igAccounts.length > 0 && (
        <div className="igAccount flex flex-col gap-1">
          {igAccounts.map(({ name, description }, i) => (
            <div key={i} className="flex flex-col">
              <div className="flex gap-1 items-center">
                <PostLogo logo="instagram" color="#343b3e" />
                <Link
                  className="hover:underline hover:underline-offset-4 max-w-full break-words font-semibold text-hh-900 italic hover:text-hh-700 active:text-hh-900 visited:text-hh-700"
                  href={`https://instagram.com/${name}`}
                >
                  @{name}
                </Link>
              </div>
              <small className="text-xs">{description}</small>
            </div>
          ))}
        </div>
      )}
      {!!link && (
        <div className="flex gap-1 mt-1">
          <div className="min-w-6 mt-1 flex justify-center">
            <PostLogo logo="link" color="#343b3e" size="1rem" />
          </div>
          <Link
            className="underline underline-offset-2 max-w-full break-words text-hh-800 italic hover:text-hh-700 active:text-hh-900 visited:text-hh-700"
            href={link}
          >
            {link}
          </Link>
        </div>
      )}
    </section>
  );
}
