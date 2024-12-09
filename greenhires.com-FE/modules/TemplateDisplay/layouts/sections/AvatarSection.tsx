import Image from "next/image";
import { getStyle } from "..";

export const AvatarSection = ({
  src,
  width,
  height,
  parsedCss,
}: {
  src: string;
  width: string | number;
  height: string | number;
  parsedCss: unknown;
}) => {
  return (
    <div
      className="relative overflow-hidden"
      style={{ ...getStyle(parsedCss, "avatar"), height }}
    >
      <div style={{ width }}>
        {src !== "" && <Image src={src} alt="Profile Picture" fill />}
      </div>
    </div>
  );
};
