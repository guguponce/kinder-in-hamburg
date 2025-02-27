import AdminServerComponent from "@app/providers/AdminServerComponents";
import LinkActive from "./LinkActive";
import Link from "next/link";
import React from "react";

export default function NavLinks() {
  return (
    <AdminServerComponent>
      <nav className="font-semibold lg:flex items-center gap-4 text-hh-50">
        {[
          { href: "/posts", name: "Posts", auth: true },
          { href: "/flohmaerkte", name: "Flohmärkte", auth: true },
          { href: "/categories", name: "Categories", auth: true },
          { href: "/bezirke", name: "Bezirke", auth: true },
        ].map(({ href, name, auth }) =>
          auth ? (
            <React.Fragment key={href}>
              <Link key={href} href={href}>
                {name}
                <LinkActive linkHref={href} />
              </Link>
            </React.Fragment>
          ) : (
            <Link key={href} href={href}>
              {name}
              <LinkActive linkHref={href} />
            </Link>
          )
        )}
      </nav>
    </AdminServerComponent>
  );
}
