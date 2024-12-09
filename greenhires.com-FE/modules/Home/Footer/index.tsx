"use client";
import { useI18n } from "@/config/i18n/client";
import { useCreateResume } from "@/services/resume/query";
import { Box, Collapse } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { toast } from "sonner";

const quickLinksTemplate = [
  {
    title: "Template",
    link: "/resume-templates",
  },
  {
    title: "Blank Page",
    link: "/ai-templates",
  },
  { title: "Cover Letter", link: "/coverletter" },
];
const quickLinksCompany = [
  {
    title: "Our Story",
    link: "/our-story",
  },
  {
    title: "Blogs",
    link: "/blogs",
  },
  {
    title: "FAQs",
    link: "/faqs",
  },
];
const Footer = () => {
  const t = useI18n();
  const collapsedRef = useRef<HTMLDivElement>(null);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();
  const { createResume } = useCreateResume();
  const createCanvaPage = async () => {
    try {
      await createResume({
        typeOfBuilder: "resumecanva",
        title: "Untitled",
        type: "resume",
      });
    } catch (error) {
      toast.error("Create resume canva failed");
    }
  };
  useEffect(() => {
    const checkAnimation = () => {
      const element = document.getElementById("animated-element");
      if (!element) {
        return;
      }
      const rect = element.getBoundingClientRect();
      const isVisible =
        rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight);
      setIsVisible(isVisible);
    };

    window.addEventListener("scroll", checkAnimation);
    return () => {
      window.removeEventListener("scroll", checkAnimation);
    };
  }, []);

  const handleTransitionEnd = () => {
    if (openCollapse) {
      const element = document.getElementById("myCollapse");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <footer
        ref={collapsedRef}
        className="wow fadeInUp block dark:bg-gray-dark relative z-10 pt-2 md:pt-8 lg:pt-6 hover:cursor-pointer bottom-0 "
        data-wow-delay=".1s"
      >
        <Image
          src="/images/footer/bg-footer.png"
          alt="bg_footer"
          width={2019}
          height={100}
          className="w-full mb-[-1px]"
        />
        <div className="relative border-[1px] border-solid border-[#306174] bg-[#306174] pb-5  mb-[-1px]">
          <Box
            component={"button"}
            id="animated-element"
            onClick={(e) => {
              setOpenCollapse(!openCollapse);
              e.stopPropagation();
            }}
            style={{
              position: "absolute",
              width: "fit-content",
              height: "fit-content",
              padding: "10px",
              borderRadius: "50%",
              left: "48%",
              bottom: 26,
              boxShadow: "0 0 30px 10px rgba(255, 255, 255, 1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0,
              transition: "opacity 0.5s",
              zIndex: "1200",
            }}
            className={`${isVisible && !openCollapse ? "opacity-100" : ""}`}
          >
            <IoPaperPlaneOutline
              size={40}
              color="white"
              style={{ margin: "2px 2px 0 0" }}
            />
          </Box>
          <div className="flex justify-between w-full px-16 bg-[#306174] ">
            <div className="text-white font-bold text-[32px] self-end uppercase">
              {t("home.subscribe")}
            </div>
            <div className="flex w-[36%] flex-col">
              <div className="flex w-full">
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white focus:outline-none"
                />
                <button className="px-6 py-3 bg-[#06B2B9] text-white">
                  {t("home.subscribe")}
                </button>
              </div>
              <p className="text-[14px] text-white mt-2">
                Subscribe to stay tuned for new web design and latest updates.
                Let's do it!
              </p>
            </div>
          </div>
        </div>
        <div className="  mt-0 bg-[#306174] border-[1px] border-solid border-[#306174]">
          <Collapse
            in={openCollapse}
            timeout="auto"
            unmountOnExit
            onTransitionEnd={handleTransitionEnd}
            id="myCollapse"
          >
            <section className="flex flex-col items-center mb-8">
              <div className="w-[94%] h-[1px] bg-white mb-8"></div>
              <div className="flex mx-16">
                <div className="min-w-[500px]">
                  <p className="text-white text-xl">Our Social Channels</p>
                  <div className="ml-auto flex gap-4 mt-8">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 65 51"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M58.3187 12.7101C58.3599 13.2679 58.36 13.8258 58.36 14.3836C58.36 31.3968 44.9558 51 20.4569 51C12.9093 51 5.89788 48.8882 0 45.2227C1.07238 45.3422 2.10337 45.382 3.21701 45.382C9.44472 45.382 15.1777 43.3501 19.7558 39.8837C13.8991 39.7641 8.99111 36.0586 7.30009 30.9586C8.12503 31.078 8.94985 31.1578 9.81605 31.1578C11.0121 31.1578 12.2082 30.9983 13.3218 30.7196C7.21769 29.5241 2.63949 24.3445 2.63949 18.089V17.9297C4.41291 18.886 6.47527 19.4836 8.66103 19.5632C5.07281 17.2522 2.72201 13.3078 2.72201 8.84522C2.72201 6.45464 3.38179 4.26324 4.53669 2.35072C11.0945 10.1601 20.9518 15.26 32.005 15.8179C31.7988 14.8617 31.6751 13.8657 31.6751 12.8695C31.6751 5.77728 37.6142 0 44.9968 0C48.8325 0 52.2969 1.5539 54.7303 4.06406C57.7411 3.50628 60.6281 2.43044 63.1853 0.956257C62.1953 3.94461 60.092 6.45476 57.3287 8.0484C60.0096 7.76963 62.6079 7.05229 65 6.05629C63.1856 8.60619 60.917 10.8772 58.3187 12.7101Z"
                        fill="white"
                      />
                    </svg>
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 64 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M64 30.1826C64 13.5091 49.6774 0 32 0C14.3226 0 0 13.5091 0 30.1826C0 45.2471 11.7019 57.7339 27 60V38.9075H18.871V30.1826H27V23.5327C27 15.9688 31.7742 11.7907 39.0865 11.7907C42.5884 11.7907 46.2503 12.3797 46.2503 12.3797V19.8037H42.2142C38.24 19.8037 37 22.1306 37 24.5172V30.1826H45.8748L44.4555 38.9075H37V60C52.2981 57.7339 64 45.2471 64 30.1826Z"
                        fill="white"
                      />
                    </svg>
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 62 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_12_1878)">
                        <path
                          d="M62.4152 -4H-2.36955C-5.33807 -4 -7.75 -1.92857 -7.75 0.614286V55.3857C-7.75 57.9286 -5.33807 60 -2.36955 60H62.4152C65.3837 60 67.8125 57.9286 67.8125 55.3857V0.614286C67.8125 -1.92857 65.3837 -4 62.4152 -4ZM15.0874 50.8571H3.88797V20.3143H15.1043V50.8571H15.0874ZM9.48769 16.1429C5.8951 16.1429 2.99404 13.6714 2.99404 10.6429C2.99404 7.61429 5.8951 5.14286 9.48769 5.14286C13.0634 5.14286 15.9813 7.61429 15.9813 10.6429C15.9813 13.6857 13.0803 16.1429 9.48769 16.1429ZM57.0685 50.8571H45.869V36C45.869 32.4571 45.7847 27.9 40.05 27.9C34.2142 27.9 33.3202 31.7571 33.3202 35.7429V50.8571H22.1208V20.3143H32.8648V24.4857H33.0166C34.5178 22.0857 38.1778 19.5571 43.6258 19.5571C54.9601 19.5571 57.0685 25.8857 57.0685 34.1143V50.8571Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_12_1878">
                          <rect width="62" height="60" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div>
                    <div className="mb-2 lg:mb-2">
                      <div className="flex flex-col gap-3 ">
                        <div className="mb-2 text-base text-white text-justify font-bold text-[16px]">
                          <p>Company</p>
                          <div className="w-8 h-[1px] bg-[#06B2B9] mt-1"></div>
                        </div>
                        {quickLinksCompany.map((quick, idx) => (
                          <div key={idx}>
                            <Link
                              href={`${quick.link}`}
                              className="text-white dark:text-body-color-dark 
                          inline-block text-base duration-300 hover:text-primary dark:hover:text-primary"
                            >
                              {quick.title}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 lg:mb-2">
                      <div className="flex flex-col gap-3">
                        <div className="mb-2 text-base text-white text-justify font-bold text-[16px]">
                          <p>Resume</p>
                          <div className="w-8 h-[1px] bg-[#06B2B9] mt-1"></div>
                        </div>
                        {quickLinksTemplate.map((quick, idx) => (
                          <div key={idx}>
                            <div
                              onClick={() => {
                                if (quick.link === "/ai-templates") {
                                  createCanvaPage();
                                } else {
                                  router.push(quick.link);
                                }
                              }}
                              className="text-white dark:text-body-color-dark 
                          inline-block text-base duration-300 hover:text-primary dark:hover:text-primary"
                            >
                              {quick.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 lg:mb-2">
                      <div className="flex flex-col gap-3 ">
                        <div className="mb-2 text-base text-white text-justify font-bold text-[16px]">
                          <p>Contact Us</p>
                          <div className="w-8 h-[1px] bg-[#06B2B9] mt-1"></div>
                        </div>
                        <div className="flex gap-3 text-white">
                          <Image
                            alt="location icon"
                            src={"/images/footer/location.svg"}
                            width={20}
                            height={20}
                            style={{
                              filter:
                                "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                            }}
                          />
                          68B Nguyen Van Troi Street, Ward 8, Phu Nhuan
                          District, Ho Chi Minh City
                        </div>
                        <div className="flex gap-3 text-white">
                          <Image
                            alt="location icon"
                            src={"/images/footer/email.svg"}
                            width={20}
                            height={20}
                            style={{
                              filter:
                                "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                            }}
                          />
                          business@greenhires.com
                        </div>
                        <div className="flex gap-3 text-white">
                          <Image
                            alt="location icon"
                            src={"/images/footer/phone.svg"}
                            width={20}
                            height={20}
                            style={{
                              filter:
                                "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                            }}
                          />
                          (+84) 369 - 369 - 369
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Collapse>
        </div>
      </footer>
    </>
  );
};

export default Footer;
