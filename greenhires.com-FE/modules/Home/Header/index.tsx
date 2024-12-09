"use client";

// nextjs
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// config
import { Locale } from "@/config";
import { useI18n } from "@/config/i18n/client";
import { useAuthStore } from "@/stores/auth";

// material-ui

import { UserDto } from "@/interfaces/user";
import { useSignOut } from "@/services/user";
import { useEffect, useState } from "react";
import { LanguageSelect } from "./LanguageSelect";
import menuData from "./menuData";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useCreateResume } from "@/services/resume/query";
import classNames from "classnames";
import { toast } from "sonner";

const AccoutButton = ({ user }: { user: UserDto }) => {
  let dashboardHref = "";
  const { logout } = useSignOut(user.role !== "enduser");

  switch (user.role) {
    case "enduser":
      dashboardHref = "/dashboard/resumes";
      break;
    case "consultant":
      dashboardHref = "/consultant/dashboard";
      break;
    case "admin":
      dashboardHref = "/admin/dashboard";
      break;
    case "superadmin":
      dashboardHref = "/admin/dashboard";
      break;
    default:
      dashboardHref = "";
      break;
  }

  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <div className="h-min self-center py-1 pl-1 pr-3 flex items-center cursor-pointer will-change-transform transition-colors hover:bg-slate-100 border- rounded-3xl">
          <div className="flex items-center">
            <Image
              src={user.picture || "/images/auth/avatar.svg"}
              width={30}
              height={30}
              alt="avatar"
              style={{ borderRadius: "50%", height: "30px" }}
            />
            <p className="ml-2 text-primary font-semibold">{`${user.lastname} ${user.firstname}`}</p>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="z-[2001] p-0 max-w-min" asChild>
        <div>
          <Link
            href={dashboardHref}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-black rounded-md cursor-pointer hover:bg-slate-100"
          >
            Dashboard
          </Link>
          <button
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-black rounded-md cursor-pointer hover:bg-slate-100"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const Header = ({
  locale,
  isHasTop,
}: {
  locale: Locale;
  isHasTop: boolean;
}) => {
  // Navbar toggle
  const t = useI18n();
  const user = useAuthStore()((state) => state.user);
  const [openIndex, setOpenIndex] = useState(-1);
  const [toggle, setToggle] = useState("cvEditor");
  const router = useRouter();
  const usePathName = usePathname();
  useEffect(() => {
    if (usePathName.includes("job")) {
      setToggle("jobSearching");
    } else {
      setToggle("cvEditor");
    }
  }, [usePathName]);
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
  return (
    <div className={`h-fit w-full z-[100] ${isHasTop ? "relative" : ""}`}>
      <div
        className={`flex divide-y flex-col justify-center w-full ${isHasTop ? "fixed bg-white" : "bg-sky-50"}`}
      >
        {isHasTop && (
          <div className="flex items-center md:mx-20">
            <div
              onClick={() => router.replace("/")}
              className="cursor-pointer flex items-center flex-col justify-center"
            >
              <Image
                src="/images/logo/humantree.svg"
                alt="Vercel Logo"
                className="dark:invert"
                width={79}
                height={37}
                priority
              />
              <p>
                <span className="text-secondary-main">Green</span>
                <span className="text-primary-main">Hires</span>
              </p>
            </div>
            <div className="ml-auto flex border-[1px] rounded-full text-primary">
              <button
                className={classNames(
                  "transition-all duration-300 rounded-full px-9 py-2 focus:outline-none",
                  toggle === "cvEditor" && "bg-primary-main text-white"
                )}
                id="cvEditorBtn"
                onClick={() => {
                  setToggle("cvEditor");
                  router.push("/");
                }}
              >
                {t("mainfeature.cveditor")}
              </button>
              <button
                className={classNames(
                  "transition-all duration-300 rounded-full px-9 py-2 focus:outline-none",
                  toggle === "jobSearching" && "bg-primary-main text-white"
                )}
                id="jobSearchingBtn"
                onClick={() => {
                  setToggle("jobSearching");
                  router.push("/jobs/home");
                }}
              >
                {t("mainfeature.jobsearching")}
              </button>
            </div>
            <div className="flex ml-auto">
              <Link href="/faqs" className="p-2 flex items-center">
                FAQs
              </Link>
              <LanguageSelect locale={locale} />
              {!!user ? (
                <AccoutButton user={user} />
              ) : (
                <Link href="/auth/signin" className="p-2 flex items-center">
                  <div className="flex">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.5 1.66016C6.92708 1.66016 6.38672 1.77083 5.87891 1.99219C5.37109 2.21354 4.92839 2.51302 4.55078 2.89062C4.17318 3.26823 3.8737 3.71094 3.65234 4.21875C3.44401 4.71354 3.33984 5.25391 3.33984 5.83984C3.33984 6.41276 3.44401 6.95312 3.65234 7.46094C3.8737 7.96875 4.17318 8.4082 4.55078 8.7793C4.92839 9.15039 5.37109 9.44661 5.87891 9.66797C6.38672 9.88932 6.92708 10 7.5 10C8.07292 10 8.61328 9.88932 9.12109 9.66797C9.62891 9.44661 10.0716 9.15039 10.4492 8.7793C10.8268 8.4082 11.1263 7.96875 11.3477 7.46094C11.556 6.95312 11.6602 6.41276 11.6602 5.83984C11.6602 5.25391 11.556 4.71354 11.3477 4.21875C11.1263 3.71094 10.8268 3.26823 10.4492 2.89062C10.0716 2.51302 9.62891 2.21354 9.12109 1.99219C8.61328 1.77083 8.07292 1.66016 7.5 1.66016ZM7.5 3.33984C8.1901 3.33984 8.7793 3.58398 9.26758 4.07227C9.75586 4.56055 10 5.14974 10 5.83984C10 6.52995 9.75586 7.11914 9.26758 7.60742C8.7793 8.0957 8.1901 8.33984 7.5 8.33984C6.8099 8.33984 6.2207 8.0957 5.73242 7.60742C5.24414 7.11914 5 6.52995 5 5.83984C5 5.14974 5.24414 4.56055 5.73242 4.07227C6.2207 3.58398 6.8099 3.33984 7.5 3.33984ZM15 15.6445C14.974 15.0977 14.8503 14.5833 14.6289 14.1016C14.3945 13.6068 14.0918 13.1803 13.7207 12.8223C13.3496 12.4642 12.9167 12.181 12.4219 11.9727C11.9271 11.7643 11.3997 11.6602 10.8398 11.6602L3.98438 11.6797C3.4375 11.6927 2.91667 11.8164 2.42188 12.0508C1.9401 12.2721 1.52018 12.5716 1.16211 12.9492C0.804036 13.3268 0.520833 13.763 0.3125 14.2578C0.104167 14.7526 0 15.2799 0 15.8398V17.5V17.5977C0.0260417 17.806 0.117188 17.9818 0.273438 18.125C0.429688 18.2682 0.61849 18.3398 0.839844 18.3398C1.0612 18.3398 1.25326 18.2585 1.41602 18.0957C1.57878 17.9329 1.66016 17.7344 1.66016 17.5V15.8398L1.67969 15.6836C1.70573 15.0326 1.95964 14.4792 2.44141 14.0234C2.92318 13.5677 3.49609 13.3398 4.16016 13.3398H10.9766C11.6406 13.3789 12.2005 13.6393 12.6562 14.1211C13.112 14.6029 13.3398 15.1758 13.3398 15.8398V17.5V17.5977C13.3659 17.806 13.457 17.9818 13.6133 18.125C13.7695 18.2682 13.9518 18.3398 14.1602 18.3398C14.3945 18.3398 14.5931 18.2585 14.7559 18.0957C14.9186 17.9329 15 17.7344 15 17.5V15.8398V15.6445Z"
                        fill="#8898AA"
                      />
                    </svg>
                    <p className="ml-1 hidden md:block">{t("auth.signin")}</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
        <div
          className={classNames(
            "relative flex justify-center bg-white z-[2000]",
            !isHasTop && "p-[5px]"
          )}
        >
          {!isHasTop && (
            <div
              onClick={() => router.replace("/")}
              className="cursor-pointer mx-10 flex items-center flex-col justify-center"
            >
              <Image
                src="/images/logo/humantree.svg"
                alt="Vercel Logo"
                className="dark:invert"
                width={79}
                height={37}
                priority
              />
              <p>
                <span className="text-secondary-main">Green</span>
                <span className="text-primary-main">Hires</span>
              </p>
            </div>
          )}
          <div className="mx-20 items-center w-full flex space-x-16 justify-start">
            {menuData.map((menuItem, index) => (
              <div key={index} className="group relative">
                {menuItem.path ? (
                  <Link
                    href={menuItem.path}
                    className={`flex py-4 text-base text-primary mr-0 lg:inline-flex lg:px-0 ${
                      usePathName === menuItem.path
                        ? "text-primary dark:text-white"
                        : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                    }`}
                  >
                    {menuItem.title}
                  </Link>
                ) : (
                  <>
                    <p
                      onClick={() => {
                        menuItem.link && router.push(menuItem.link);
                      }}
                      className="flex cursor-pointer items-center justify-between py-4 text-base text-primary
                               group-hover:text-primary dark:text-white/70 
                               dark:group-hover:text-white mr-0 lg:inline-flex px-0"
                    >
                      {menuItem.title}
                      <span className="pl-3">
                        <svg width="25" height="24" viewBox="0 0 25 24">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    </p>
                    <div
                      className={classNames(
                        `submenu relative top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                          openIndex === index ? "block" : "hidden"
                        }`,
                        menuItem.id === 1 ? "w-[400px]" : "w-[600px]"
                      )}
                    >
                      <div
                        className={
                          menuItem.id === 1
                            ? "flex flex-col gap-4"
                            : "grid grid-cols-2 gap-4"
                        }
                      >
                        {menuItem.submenu?.map(
                          (submenuItem: any, index: number) => (
                            <div
                              onClick={() => {
                                if (submenuItem.path === "/ai-templates") {
                                  createCanvaPage();
                                } else {
                                  router.push(submenuItem.path);
                                }
                              }}
                              className="hover:text-secondary-main cursor-pointer"
                              key={index}
                            >
                              <div className="flex items-center whitespace-pre gap-2 rounded py-2">
                                {submenuItem?.icon}
                                <p className="text-xl font-bold">
                                  {submenuItem.title}
                                </p>
                              </div>
                              <div className="text-md">
                                {submenuItem.description}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="flex flex-1 justify-end text-secondary-main font-bold">
              <Link href="/job-searching">For Employer</Link>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Header;
