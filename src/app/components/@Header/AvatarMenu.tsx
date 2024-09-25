"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import AdminClientComponent from "@app/providers/AdminClientComponents";

export default function AvatarMenu({
  email,
  avatar,
  initials,
  children,
}: {
  email: string | undefined | null;
  avatar: string | undefined | null;
  initials: string;
  children: React.ReactNode;
}) {
  const [imgDisplay, setImgDisplay] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const imgRef = React.useRef<HTMLImageElement>(null);

  const menuList = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuList.current &&
        !menuList.current.contains(event.target as Node)
      ) {
        setMenuOpen(false); // Close setMenuOpen menu if the click is outside the menu
      }
    };

    if (menuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);
  return (
    <div className="flex mx-1 w-14 items-center justify-center relative">
      <button
        color="#fefefe"
        aria-label="Options"
        title={email ? email : ""}
        onClick={toggleMenu}
        className="relative w-8 h-8 flex justify-center items-center text-white font-bold text-sm rounded-full bg-hh-700 bg-contain bg-center"
      >
        <span className="mt-[1px]">{initials ? initials : ""}</span>
        {imgDisplay && (
          <img
            loading="lazy"
            src={avatar || ""}
            className="absolute z-[500] w-full h-full rounded-full"
            alt=""
            ref={imgRef}
            onError={() => setImgDisplay(false)}
          />
        )}
      </button>
      {menuOpen && (
        <AdminClientComponent>
          <nav
            ref={menuList}
            id="menu-list"
            className="absolute top-[calc(100%+24px)] -right-2 sm:-right-3 lg:-right-4  shadow-lg sm:w-[33vw] sm:max-w-[150px] z-[300] flex flex-col bg-gradient-to-b from-hh-200 rounded-[0_0_4px_0] to-hh-100"
          >
            {[
              { admin: true, href: "/dashboard", name: "Dashboard" },
              { admin: true, href: "/dashboard/posts", name: "Posts approval" },
              {
                admin: true,
                href: "/dashboard/flohmaerkte",
                name: "Flohmärkte approval",
              },
              { admin: true, href: "/new-post", name: "New Place Suggestion" },
              { admin: true, href: "/new-flohmarkt", name: "New Flohmarkt" },
              { admin: true, href: "/new-post", name: "New Post" },
            ].map(({ name, href, admin }, i) =>
              admin ? (
                <React.Fragment key={name}>
                  <Link
                    className={
                      "border-b-2 border-black rounded-none py-1 px-2  font-semibold w-full text-center text-hh-950"
                    }
                    href={href}
                    onClick={() =>
                      setTimeout(() => {
                        setMenuOpen(false);
                      }, 100)
                    }
                  >
                    {name}
                  </Link>
                </React.Fragment>
              ) : (
                <Link
                  className={
                    "border-b-2 border-black rounded-none py-1 px-2  font-semibold w-full text-center text-hh-950"
                  }
                  key={name}
                  href={href}
                  onClick={() =>
                    setTimeout(() => {
                      setMenuOpen(false);
                    }, 100)
                  }
                >
                  {name}
                </Link>
              )
            )}
            {children}
          </nav>
        </AdminClientComponent>
      )}
    </div>
  );
}
