"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSignOut } from "@/services/user";
import { Browser, SignOut, User, Users } from "@phosphor-icons/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Collapse";

export function AdminSideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useSignOut(true);
  return (
    <div
      className={cn(
        "pb-12 w-[22%] bg-primary-main h-[calc(100vh-60px)] sticky left-0 top-[60px] overflow-y-scroll"
      )}
    >
      <div className="space-y-4 py-8">
        <div className="px-3 py-2">
          <Button
            onClick={() => router.push("/admin/dashboard")}
            variant={"ghost"}
            className={`w-full mb-2 ml-1 px-4 tracking-tight flex justify-start gap-3 text-white text-base font-medium hover:bg-[#788E99] hover:text-white ${pathname === "/admin/dashboard" && "bg-[#788E99]"}`}
          >
            <Browser size={24} />
            Dashboard
          </Button>
          <p className="font-medium pl-4 mb-2  text-white ">Pages</p>
          <Accordion
            type="multiple"
            className="w-full space-y-5"
            defaultValue={[
              `${/^\/admin\/samples/.test(pathname) && "item-1"}`,
              `${/^\/admin\/blogs/.test(pathname) && "item-2"}`,
              `${/^\/admin\/users/.test(pathname) && "item-3"}`,
            ]}
          >
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-white py-0">
                <div className="flex gap-1 ml-5 ">
                  <Users size={24} className="mr-3" />
                  User
                </div>
              </AccordionTrigger>
              <AccordionContent
                onClick={() => router.push("/admin/users")}
                className={`ml-14 pl-6 mt-2 py-2 rounded-md align-middle hover:cursor-pointer hover:bg-[#788E99] text-base font-normal text-white ${pathname === "/admin/users" && "bg-[#788E99]"}`}
              >
                User Management
              </AccordionContent>
              <AccordionContent
                onClick={() => router.push("/admin/users/create")}
                className={`ml-14 pl-6 mt-2 py-2 rounded-md align-middle hover:cursor-pointer hover:bg-[#788E99] text-base font-normal text-white ${pathname === "/admin/users/create" && "bg-[#788E99]"}`}
              >
                Add new user
              </AccordionContent>
              <AccordionContent
                onClick={() => router.push("/admin/users/activity")}
                className={`ml-14 pl-6 mt-2 py-2 rounded-md align-middle hover:cursor-pointer hover:bg-[#788E99] text-base font-normal text-white ${pathname === "/admin/users/activity" && "bg-[#788E99]"}`}
              >
                User's activity
              </AccordionContent>
            </AccordionItem>
            <Button
              onClick={() => router.push("/admin/profile")}
              variant={"ghost"}
              className={`w-full mb-2 px-4 ml-1   tracking-tight flex justify-start gap-1 text-white text-base font-medium hover:bg-[#788E99] hover:text-white ${pathname === "/admin/profile" && "bg-[#788E99]"}`}
            >
              <User size={24} className="mr-3" />
              Profile
            </Button>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-white py-0">
                <div className="flex gap-1 ml-5 ">
                  <Image
                    alt="blog icon"
                    src={"/images/admin/blog.svg"}
                    height={26}
                    width={26}
                    className="mr-3"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                    }}
                  />
                  Blog
                </div>
              </AccordionTrigger>
              <AccordionContent
                onClick={() => router.push("/admin/my-blogs")}
                className={`ml-14  mt-2 pl-6 py-2 rounded-md align-middle hover:cursor-pointer hover:bg-[#788E99] text-base font-normal text-white ${/^\/admin\/my-blogs/.test(pathname) && "bg-[#788E99]"} `}
              >
                My blogs
              </AccordionContent>
              <AccordionContent
                onClick={() => router.push("/admin/blogs/review")}
                className={`ml-14  mt-2 pl-6 py-2 rounded-md align-middle hover:cursor-pointer hover:bg-[#788E99] text-base font-normal text-white ${/^\/admin\/blogs\/review/.test(pathname) && "bg-[#788E99]"} `}
              >
                Review
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white py-0">
                <div className="flex gap-1 ml-5  ">
                  <Image
                    alt="blog icon"
                    src={"/images/admin/template.svg"}
                    height={20}
                    width={20}
                    className="mr-3"
                  />
                  Samples
                </div>
              </AccordionTrigger>
              <AccordionContent
                onClick={() => router.push("/admin/samples/my-samples")}
                className={`ml-14 pl-6 mt-2 py-2 rounded-md align-middle hover:cursor-pointer hover:bg-[#788E99] text-base font-normal text-white ${/^\/admin\/samples\/my-samples/.test(pathname) && !/^\/admin\/samples\/.*\/review$/.test(pathname) && "bg-[#788E99]"}`}
              >
                My Samples
              </AccordionContent>
              <AccordionContent
                onClick={() => router.push("/admin/samples/review")}
                className={`ml-14 pl-6 mt-2 py-2 rounded-md align-middle hover:cursor-pointer hover:bg-[#788E99] text-base font-normal text-white ${(/^\/admin\/samples\/review/.test(pathname) || /^\/admin\/samples\/.*\/review$/.test(pathname)) && "bg-[#788E99]"}`}
              >
                Review
              </AccordionContent>
            </AccordionItem>

            <Button
              onClick={() => router.push("/admin/dashboard")}
              variant={"ghost"}
              className={`w-full mb-2 px-4 ml-1   tracking-tight flex justify-start gap-1 text-white text-base font-medium hover:bg-[#788E99] hover:text-white `}
            >
              <Image
                alt="blog icon"
                src={"/images/admin/notification.svg"}
                height={20}
                width={20}
                className="mr-3"
              />
              Notification
            </Button>
            <Button
              onClick={() => router.push("/admin/dashboard")}
              variant={"ghost"}
              className={`w-full mb-2 px-4 ml-1   tracking-tight flex justify-start gap-1 text-white text-base font-medium hover:bg-[#788E99] hover:text-white `}
            >
              <Image
                alt="blog icon"
                src={"/images/admin/pricing.svg"}
                height={24}
                width={24}
                className="mr-3"
              />
              Pricing
            </Button>
            <Button
              onClick={() => router.push("/admin/dashboard")}
              variant={"ghost"}
              className={`w-full mb-2 px-4 ml-1   tracking-tight flex justify-start gap-1 text-white text-base font-medium hover:bg-[#788E99] hover:text-white `}
            >
              <Image
                alt="blog icon"
                src={"/images/admin/faq.svg"}
                height={24}
                width={24}
                className="mr-3"
              />
              FAQs
            </Button>
            <Button
              onClick={() => {
                logout();
              }}
              variant={"ghost"}
              className={`w-full mb-2 px-4 ml-1   tracking-tight flex justify-start gap-1 text-white text-base font-medium hover:bg-[#788E99] hover:text-white`}
            >
              <SignOut size={24} className="mr-3" />
              Sign out
            </Button>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
