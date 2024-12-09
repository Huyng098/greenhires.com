"use client";
import { Category } from "@/interfaces/general/category";
import BlogAboutPageImage from "@/public/images/blog/blog-about-page.jpg";
import { useGetAllPublicBlogs } from "@/services/blog/query";
import { Pagination } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment } from "react";
import { BlogCard } from "./blogCard";

interface Props {
  categories: Category[];
}
const ListBlog = ({ categories }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const limit = 12;
  function convertObjectToQueryParams(obj: object) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
      if (!value) continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          params.append(key, encodeURIComponent(item));
        }
      } else {
        params.set(key, encodeURIComponent(value));
      }
    }
    return params.toString();
  }

  const updatePath = (condition: any) => {
    const parameters = convertObjectToQueryParams(condition);
    router.push(`${pathname}?${parameters}`);
  };
  const { data } = useGetAllPublicBlogs(
    Number(searchParams.get("page")) > 0 ? Number(searchParams.get("page")) : 1,
    limit
  );

  return (
    <div className="bg-gray-200">
      <div className="relative flex justify-center">
        <Image
          src={BlogAboutPageImage}
          alt=""
          className="w-screen mt-[130px]"
        />
        <div className="bg-gradient-to-r from-[#2F566B] to-[#06B2B9 9%] w-3/5 h-[20rem] absolute -bottom-32 z-50 text-center text-white py-10">
          <div>
            {categories.map((category, idx) => (
              <Fragment key={idx}>
                <span key={category.id} className="uppercase font-bold">
                  {category.name}
                </span>
                {idx !== categories.length - 1 && (
                  <span className="font-bold mx-3">|</span>
                )}
              </Fragment>
            ))}
          </div>
          <p className="text-4xl font-bold my-10">
            Useful information for <br />
            your resume
          </p>
          <span>@Copyright 2024 by AIVision.vn</span>
        </div>
      </div>
      <div className="flex mt-48 flex-col items-center">
        <div className="w-full grid gap-10 grid-flow-row-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-24 pb-10">
          {data?.items?.map((item, id) => (
            <BlogCard
              key={item.id}
              id={item.id}
              title={item.title}
              content={item.content}
              image={item.banner}
              author={{
                avatar: item.author_picture,
                name: item.author_name,
              }}
              createdDate={dayjs(item.created_at).format("MMMM, YYYY")}
            />
          ))}
        </div>
        <div className="flex w-full justify-end px-10">
          {(data?.total ?? 0) / limit > 1 && (
            <Pagination
              count={Math.ceil((data?.total ?? 0) / limit)}
              page={
                Number(searchParams.get("page")) > 0
                  ? Number(searchParams.get("page"))
                  : 1
              }
              onChange={(event, page) => {
                updatePath({
                  page: page,
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default ListBlog;
