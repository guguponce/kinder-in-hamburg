import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full  max-w-[1000px] xl:max-w-[1200px] rounded-xl bg-hh-100 p-2 sm:p-4 md:p-6 text-hh-950">
      {children}
    </main>
  );
}
