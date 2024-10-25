import { getEventWithID } from "@app/api/dbActions";
import { ImageResponse } from "next/og";
import { logoFont } from "@app/styles/fonts/localfonts";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const alt = "Kinder in Hamburg";

export default async function Image({
  params,
}: {
  params: { eventID: string };
}) {
  const event = (await getEventWithID(params.eventID)) || null;

  const imgSrc =
    event?.image || event?.type === "laterne"
      ? "/assets/icons/laterne/laterne.svg"
      : "/assets/logo/KiHLogo.png";

  return new ImageResponse(
    (
      <div
        className={`relative text-hh-50 w-full h-full flex justify-center bg-hh-700 ${logoFont.className}`}
      >
        <h2 className="font-semibold absolute top-1 left-1">{event?.title}</h2>
        <img className="w-full h-full object-contain" src={imgSrc} alt={alt} />
        <h1 className="font-bold absolute bottom-1 right-1 text-sm">
          Kinder in Hamburg
        </h1>
      </div>
    ),
    {
      ...size,
    }
  );
}
