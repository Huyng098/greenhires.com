import { Feature } from "@/interfaces/general/feature";
import Image from "next/image";

const SingleFeature = ({
  feature,
  isMobile,
}: {
  feature: Feature;
  isMobile?: boolean;
}) => {
  const { icon, title, paragraph } = feature;
  return (
    <div
      className="border-secondary-main border-b-[1px] transition ease-in-out delay-550 p-3 duration-500
      hover:-translate-y-5 hover:shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)]"
    >
      <div
        className="flex gap-4 justify-center items-center wow fadeInUp"
        data-wow-delay=".15s"
      >
        <Image src={icon} alt={title} width={100} height={100} />
        <div>
          <h3 className="mb-5 text-xl font-bold">{title}</h3>
          {!isMobile && (
            <p className="pr-[10px] text-base font-medium leading-relaxed text-gray-600">
              {paragraph}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleFeature;
