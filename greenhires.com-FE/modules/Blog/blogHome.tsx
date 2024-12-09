import { useGetAllPublicBlogs } from "@/services/blog/query";
import dayjs from "dayjs";
import { BlogCard } from "./blogCard";

export const BlogHome = () => {
  const { data } = useGetAllPublicBlogs(1, 4);
  return (
    <section className="flex flex-col justify-center items-center">
      <p className="text-3xl mb-10 text-primary-main font-bold">
        Stay updated with the latest resume templates and business news
      </p>
      <div className="w-full grid gap-4 grid-flow-row-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-5 px-24 pb-5">
        {data?.items?.map((item) => (
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
    </section>
  );
};
