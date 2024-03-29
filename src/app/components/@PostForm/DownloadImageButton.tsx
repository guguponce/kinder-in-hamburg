import React from "react";
interface DownloadImageButtonProps {
  imageUrl: string;
  imageName: string;
}

const DownloadImageButton: React.FC<DownloadImageButtonProps> = ({
  imageUrl,
  imageName,
}) => {
  const download = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    var element = document.createElement("a");
    var file = new Blob([imageUrl], { type: "image/*" });
    element.href = URL.createObjectURL(file);
    element.download = imageName;
    element.click();
  };
  return (
    <a
      className="flex h-10 w-10 items-center justify-center rounded bg-blue-500 px-2 py-2 font-bold text-white hover:bg-blue-700 "
      href={imageUrl}
      download={imageName}
      onClick={(e) => download(e)}
    >
      <svg
        style={{ display: "inline-block", width: "1.5rem", height: "1.5rem" }}
        fill="none"
      >
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M8 22.0002H16C18.8284 22.0002 20.2426 22.0002 21.1213 21.1215C22 20.2429 22 18.8286 22 16.0002V15.0002C22 12.1718 22 10.7576 21.1213 9.8789C20.3529 9.11051 19.175 9.01406 17 9.00195M7 9.00195C4.82497 9.01406 3.64706 9.11051 2.87868 9.87889C2 10.7576 2 12.1718 2 15.0002L2 16.0002C2 18.8286 2 20.2429 2.87868 21.1215C3.17848 21.4213 3.54062 21.6188 4 21.749"
            stroke="#fefefe"
            strokeWidth="1.5"
            strokeLinecap="round"
          ></path>{" "}
          <path
            d="M12 2L12 15M12 15L9 11.5M12 15L15 11.5"
            stroke="#fefefe"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </svg>
    </a>
  );
};

export default DownloadImageButton;
