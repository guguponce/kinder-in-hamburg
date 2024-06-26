import React from "react";
import SpielplatzgeraeteBackground from "./SpielplatzgeraeteBackground";
import SpielgeraeteIcon from "./@Icons/@Spielplatz/SpielgeraeteIcon";

export default function SpielplatzPoster({
  title,
  image,
  spielgeraete,
  backupImg,
  bezirk,
  stadtteil,
}: {
  backupImg: string;
  title: string;
  bezirk?: string;
  stadtteil?: string;
  image?: string;
  spielgeraete?: string[];
}) {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <h3 className="font-bold text-xl text-hh-50 p-2 text-center rounded bg-hh-900 bg-opacity-25 backdrop-blur-sm absolute z-10 flex flex-col">
        {title}
        {stadtteil && (
          <span className="block text-xs">
            ({stadtteil}, {bezirk})
          </span>
        )}
      </h3>
      <div className="w-full h-full flex items-center justify-center rounded overflow-hidden">
        {!!image ? (
          <img
            loading="lazy"
            src={image}
            alt={title}
            className="object-cover w-full h-full rounded"
          />
        ) : (
          <>
            {spielgeraete && (
              <div className="w-full h-full relative flex flex-col justify-center rounded items-center gap-2 overflow-hidden">
                <SpielplatzgeraeteBackground spList={spielgeraete} />
                <div className="h-4/5 aspect-square mt-auto flex justify-center items-center">
                  <SpielgeraeteIcon
                    logo={backupImg || "spielplatz"}
                    color="#fefefe"
                    size="80%"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
