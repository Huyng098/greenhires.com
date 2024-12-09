import { Feature } from "@/interfaces/general/feature";

const SingleFeatureMobile = ({
  feature,
  isMobile,
}: {
  feature: Feature;
  isMobile?: boolean;
}) => {
  const { icon, title, paragraph } = feature;
  return (
    <div
      className="w-full  transition ease-in-out delay-550 p-6 rounded-3xl duration-500
      hover:-translate-y-5 hover:shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)]"
    >
      <div className="wow fadeInUp flex flex-col justify-center items-center" data-wow-delay=".15s">
        <div
          className="mb-10 flex h-[70px] w-[70px] items-center justify-center
           rounded-md bg-primary-main bg-opacity-10 text-primary"
        >
          {icon}
        </div>
        <h3 className="mb-5 text-xl text-center font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
          {title}
        </h3>

        <p className=" text-base font-medium leading-relaxed text-body-color text-center">
          {paragraph}
        </p>
      </div>
    </div>
  );
};

export default SingleFeatureMobile;
