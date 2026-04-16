"use client";
import { SharingIcons } from "./SharingIcons";
import {
  useEffect,
  useCallback,
  createContext,
  useContext,
  useState,
  useRef,
} from "react";
import { animate } from "motion";
function getShareText(route: string | undefined): string {
  if (!route) {
    return "Schau dir das mal an!";
  }

  if (/flohmaerkte\/\d+/.test(route)) {
    return "Entdecke diesen Markt!";
  }

  if (/posts\/\d+/.test(route)) {
    return "Lies dir diesen Beitrag durch!";
  }

  if (/spielplaetze\/\d+/.test(route)) {
    return "Schau dir diesen Ort an!";
  }

  if (/events\/\d+/.test(route)) {
    return "Sieh dir dieses Event an!";
  }

  return "Schau dir das mal an!";
}

const SharingModalContext = createContext<
  | {
      isOpen: boolean;
      openModal: () => void;
      closeModal: () => void;
    }
  | undefined
>(undefined);

export const useSharingModal = (): {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
} => {
  const context = useContext(SharingModalContext);
  if (!context) {
    throw new Error(
      "useSharingModal must be used within a SharingModalProvider",
    );
  }
  return context;
};

export const SharingModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <SharingModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen && <SharingModal />}
    </SharingModalContext.Provider>
  );
};

const SharingModal = () => {
  const { closeModal, isOpen } = useSharingModal();
  const shareFunction = useCallback((icon: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const encoded = `${getShareText(window.location.pathname)}%0A${title}%0A${url}`;
    if (window && window.open) {
      if (icon === "whatsapp") {
        window.open(
          `https://wa.me/?text=${encoded}`,
          "_blank",
          "noopener,noreferrer",
        );
      } else if (icon === "telegram") {
        window.open(
          `https://t.me/share/url?url=${url}&text=${encoded}`,
          "_blank",
          "noopener,noreferrer",
        );
      } else if (icon === "mail") {
        window.open(
          `mailto:?subject=${title}&body=${encoded}`,
          "_blank",
          "noopener,noreferrer",
        );
      }
    }
  }, []);
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log("clicked", event.target);
      console.log("contentRef", contentRef.current);
      console.log(!contentRef.current?.contains(event.target as Node));
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        console.log("outside");
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  useEffect(() => {
    if (!isOpen) return;

    const backdrop = backdropRef.current;
    const modal = contentRef.current;

    if (isOpen) {
      animate(backdrop, { opacity: [0, 1] }, { duration: 0.2 });
      animate(
        modal,
        {
          opacity: [0, 1],
          transform: ["scale(0.95) translateY(10px)", "scale(1) translateY(0)"],
        },
        { duration: 0.2 },
      );
    } else {
      // exit
      Promise.all([
        animate(backdrop, { opacity: [1, 0] }, { duration: 0.2 }).finished,
        animate(
          modal,
          {
            opacity: [1, 0],
            transform: [
              "scale(1) translateY(0)",
              "scale(0.95) translateY(10px)",
            ],
          },
          { duration: 0.2 },
        ).finished,
      ]).then(() => {
        closeModal();
      });
    }
  }, [isOpen, closeModal]);

  if (!isOpen) return null;
  return (
    <div
      ref={backdropRef}
      className="fixed h-full w-full z-[500] bg-hh-950 bg-opacity-50 flex p-4 justify-center items-center"
    >
      <div
        className="w-full max-w-[400px] h-fit aspect-video bg-gradient-to-br from-white to-hh-100 p-4 rounded relative"
        ref={contentRef}
      >
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
        >
          &times;
        </button>

        <h2 className="text-lg mb-4 font-bold">Share this page</h2>
        <div className="flex gap-4 justify-around items-center flex-wrap">
          {["whatsapp", "telegram", "mail"].map((icon) => (
            <button
              key={icon}
              className="flex flex-col items-center bg-hh-50 hover:bg-white  hover:bg-opacity-20 shadow-lg hover:outline hover:outline-2 outline-hh-950-25 p-2 rounded"
              onClick={() => shareFunction(icon)}
            >
              <SharingIcons className="w-20 h-20 rounded-full" icon={icon} />
              <span className="mt-2 text-sm font-semibold capitalize">
                {icon}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
