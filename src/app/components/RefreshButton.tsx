import { useRouter } from "next/navigation";
import React from "react";

export default function RefreshButton() {
  const router = useRouter();
  return (
    <button
      className="p-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-500"
      onClick={() => {
        router.refresh();
      }}
    >
      Try again
    </button>
  );
}
