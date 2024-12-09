"use client";
import { useI18n } from "@/config/i18n/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Menu = () => {
  const t = useI18n();
  const [feature, setFeature] = useState(0);
  const router = useRouter();
  return (
    <>
      <section id="menu-why-greenhires" className="relative bg-white">
        <div className="flex items-center container my-20">
          <div className="w-1/3 mx-10">
            {feature === 0 ? (
              <>
                <p className="text-4xl font-bold"> {t("menu.createtitle")} </p>
                <p className="text-xl text-primary my-6">
                  {" "}
                  {t("menu.createdetail")}{" "}
                </p>
              </>
            ) : (
              <>
                <p className="text-4xl font-bold"> {t("menu.requesttitle")} </p>
                <p className="text-xl text-primary my-6">
                  {" "}
                  {t("menu.requestdetail")}{" "}
                </p>
              </>
            )}
          </div>
          <div className="mx-40 h-[450px] w-[500px] bg-gradient-to-b from-slate-300 to-teal-200 rounded-[30px]">
            <div className="my-16 relative">
              <button
                onClick={() => router.push("/choose-types-of-builder")}
                onMouseOver={() => setFeature(0)}
                className={`flex absolute rounded-[20px] p-5 items-center shadow-xl shadow-indigo-200/50 
                  transition-all duration-500 ease-in-out ${
                    feature === 0
                      ? "bg-slate-600 text-white left-10 -right-10"
                      : "bg-white text-dark -left-10 right-10"
                  }`}
              >
                <Image
                  width={60}
                  height={60}
                  alt="tab-icon"
                  src="/images/menu/tab_icon_1.svg"
                />
                <div className="ml-5">
                  <p className="text-xl text-left mb-2 font-bold">
                    {t("createresume.title")}
                  </p>
                  <p className="text-sm text-left mr-14">
                    {t("createresume.detail")}
                  </p>
                </div>
              </button>
              <button
                onClick={() => router.push("/requestcv")}
                onMouseOver={() => setFeature(1)}
                className={`absolute top-20 flex shadow-indigo-200/50
                  rounded-[20px] p-6 shadow-xl items-center mt-28
                  transition-all duration-500 ease-in-out 
                  ${feature === 1 ? "bg-slate-600 text-white left-10 -right-10" : "bg-white text-dark -left-10 right-10"}`}
              >
                <Image
                  width={60}
                  height={61}
                  alt="tab-icon-2"
                  src="/images/menu/tab_icon_2.png.png"
                />
                <div className="ml-5">
                  <p className="text-xl text-left mb-2 font-bold">
                    {t("requestresume.title")}
                  </p>
                  <p className="text-sm text-left mr-14">
                    {t("requestresume.detail")}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-1/2 opacity-30 lg:opacity-100">
          <svg
            width="339"
            height="277"
            viewBox="0 0 339 277"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_12_2151)">
              <path
                d="M-138.153 99.6791C-101.151 91.6164 -10.8969 89.4511 54.0997 145.29C135.347 215.09 159.91 223.382 206.202 229.603C252.494 235.822 303.981 253.099 337.52 292.49"
                stroke="url(#paint0_linear_12_2151)"
              />
              <path
                d="M-175.461 99.6791C-138.459 91.6164 -48.2052 89.4511 16.7921 145.29C98.0389 215.09 122.602 223.382 168.894 229.603C215.186 235.822 266.674 253.099 300.212 292.49"
                stroke="url(#paint1_linear_12_2151)"
              />
              <path
                d="M-216.766 99.6791C-179.764 91.6164 -89.5101 89.4511 -24.5124 145.29C56.734 215.09 81.2971 223.382 127.589 229.603C173.881 235.822 225.369 253.099 258.907 292.49"
                stroke="url(#paint2_linear_12_2151)"
              />
              <path
                d="M-276.792 89.6996C-236.793 82.7694 -139.693 83.3593 -71.2868 141.161C14.2206 213.414 40.4119 222.453 90.0205 230.084C139.63 237.714 194.533 256.556 229.55 296.956"
                stroke="url(#paint3_linear_12_2151)"
              />
              <path
                opacity="0.8"
                d="M155.187 150.032C190.776 141.249 212.742 104.289 204.249 67.4793C195.757 30.6701 160.023 7.95066 124.434 16.7341C88.8448 25.5175 66.8787 62.4777 75.3709 99.287C83.8631 136.096 119.598 158.816 155.187 150.032Z"
                stroke="url(#paint4_linear_12_2151)"
              />
              <path
                d="M147.132 146.08C178.774 146.08 204.426 119.549 204.426 86.821C204.426 54.0933 178.774 27.5623 147.132 27.5623C115.489 27.5623 89.8379 54.0933 89.8379 86.821C89.8379 119.549 115.489 146.08 147.132 146.08Z"
                fill="url(#paint5_radial_12_2151)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_12_2151"
                x1="99.6831"
                y1="95.421"
                x2="99.6831"
                y2="292.49"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06B2B9" stopOpacity="0" />
                <stop offset="1" stopColor="#06B2B9" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_12_2151"
                x1="62.3755"
                y1="95.421"
                x2="62.3755"
                y2="292.49"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06B2B9" stopOpacity="0" />
                <stop offset="1" stopColor="#06B2B9" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_12_2151"
                x1="21.0705"
                y1="95.421"
                x2="21.0705"
                y2="292.49"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06B2B9" stopOpacity="0" />
                <stop offset="1" stopColor="#06B2B9" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_12_2151"
                x1="-20.9517"
                y1="92.7018"
                x2="-26.5429"
                y2="289.688"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06B2B9" stopOpacity="0" />
                <stop offset="1" stopColor="#06B2B9" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_12_2151"
                x1="124.279"
                y1="16.0639"
                x2="151.212"
                y2="135.97"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06B2B9" />
                <stop offset="1" stopColor="#06B2B9" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint5_radial_12_2151"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(147.132 86.821) rotate(90) scale(59.2587 57.294)"
              >
                <stop offset="0.145833" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.08" />
              </radialGradient>
              <clipPath id="clip0_12_2151">
                <rect
                  width="485"
                  height="277"
                  fill="white"
                  transform="translate(-146)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="absolute -top-1/2  z-[100] right-0 opacity-30 lg:opacity-100">
          <svg
            width="373"
            height="610"
            viewBox="0 0 373 610"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.8"
              d="M442.222 398.583C496.558 331.959 487.862 227.662 422.8 165.629C357.737 103.596 260.946 107.318 206.61 173.942C152.274 240.565 160.969 344.862 226.032 406.895C291.094 468.928 387.886 465.207 442.222 398.583Z"
              stroke="url(#paint0_linear_12_2158)"
            />
            <path
              d="M62.0184 292.601C69.9994 289.926 74.0973 280.681 71.1714 271.954C68.2455 263.226 59.4037 258.32 51.4228 260.996C43.4419 263.671 39.344 272.915 42.2699 281.643C45.1958 290.371 54.0375 295.277 62.0184 292.601Z"
              fill="url(#paint1_radial_12_2158)"
            />
            <path
              d="M145.292 383.83C160.367 378.776 168.108 361.315 162.581 344.829C157.054 328.344 140.353 319.076 125.278 324.13C110.203 329.184 102.463 346.645 107.989 363.131C113.516 379.616 130.217 388.884 145.292 383.83Z"
              fill="url(#paint2_radial_12_2158)"
            />
            <path
              d="M469.418 395.601C514.69 321.073 493.069 217.924 421.125 165.211C349.18 112.499 254.157 130.184 208.884 204.712C163.611 279.24 185.233 382.389 257.177 435.101C329.121 487.814 424.145 470.129 469.418 395.601Z"
              fill="url(#paint3_linear_12_2158)"
            />
            <path
              opacity="0.8"
              d="M116.488 332.581C111.303 399.333 157.789 460.888 220.317 470.068C282.845 479.248 337.738 432.577 342.923 365.825C348.109 299.073 301.623 237.519 239.094 228.339C176.566 219.159 121.673 265.83 116.488 332.581Z"
              stroke="url(#paint4_linear_12_2158)"
            />
            <path
              opacity="0.8"
              d="M126.827 281.778C102.031 342.424 128.862 415.858 186.755 445.798C244.647 475.739 311.679 450.848 336.475 390.202C361.27 329.557 334.44 256.123 276.547 226.182C218.654 196.242 151.622 221.133 126.827 281.778Z"
              fill="url(#paint5_linear_12_2158)"
            />
            <path
              opacity="0.8"
              d="M105.716 316.273C102.716 368.756 138.487 417.843 185.612 425.911C232.737 433.979 273.372 397.973 276.372 345.49C279.372 293.007 243.602 243.921 196.476 235.853C149.351 227.785 108.716 263.79 105.716 316.273Z"
              stroke="url(#paint6_linear_12_2158)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_12_2158"
                x1="206.281"
                y1="173.629"
                x2="458.504"
                y2="379.333"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06B2B9" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint1_radial_12_2158"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(56.7206 276.798) rotate(71.4665) scale(16.6672 15.2412)"
              >
                <stop offset="0.145833" stopColor="#06B2B9" stopOpacity="0" />
                <stop offset="1" stopColor="#06B2B9" stopOpacity="0.08" />
              </radialGradient>
              <radialGradient
                id="paint2_radial_12_2158"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(135.285 353.98) rotate(71.4665) scale(31.4825 28.7889)"
              >
                <stop offset="0.145833" stopColor="#06B2B9" stopOpacity="0" />
                <stop offset="1" stopColor="#06B2B9" stopOpacity="0.08" />
              </radialGradient>
              <linearGradient
                id="paint3_linear_12_2158"
                x1="27.1323"
                y1="178.485"
                x2="371.77"
                y2="320.068"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06B2B9" />
                <stop offset="1" stopColor="#06B2B9" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_12_2158"
                x1="343.349"
                y1="365.887"
                x2="114.849"
                y2="348.138"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06B2B9" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_12_2158"
                x1="471.174"
                y1="386.914"
                x2="206.365"
                y2="323.153"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06B2B9" />
                <stop offset="1" stopColor="#06B2B9" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_12_2158"
                x1="276.693"
                y1="345.545"
                x2="104.283"
                y2="335.689"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06B2B9" stopOpacity="0.04" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default Menu;
