"use client";
import parse from "html-react-parser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as NProgress from "nprogress";
type BlogCardType = {
  id: string;
  title: string;
  content: string;
  image: string;
  author: {
    avatar: string;
    name: string;
  };
  createdDate: string;
  className?: string;
};

export const BlogCard = ({
  id,
  title,
  content,
  image,
  author,
  createdDate,
  className,
}: BlogCardType) => {
  const router = useRouter();
  return (
    <div
      className={`
      transition ease-in-out delay-550 duration-500 hover:-translate-y-5
      bg-white relative h-[30rem] rounded-xl ${className} cursor-pointer flex flex-col justify-between`}
      onClick={() => {
        NProgress.start();
        router.push(`/blogs/detail-blog/${id}`);
      }}
    >
      <div>
        <div className="h-[230px] w-full relative rounded-xl overflow-hidden shadow-md">
          <Image
            src={image.includes("https") ? image : "/images/blog/blog.png"}
            alt="image"
            objectFit="cover"
            fill
          />
        </div>
        <div className="px-3 pb-2 pt-3">
          <div className="opacity-70 mb-3 text-sm">{createdDate}</div>
          <div className="font-semibold min-h-[50px]">{parse(title)}</div>
          <div
            className="font-medium text-sm opacity-70 overflow-hidden 
              whitespace-nowrap h-27 line-clamp-4 "
          >
            {parse(content)}
          </div>
        </div>
      </div>
    </div>
  );
};
