import ReviewBlog from "@/modules/Blog/reviewBlog";
import { getBlogById } from "@/services/blog/api";
import { redirect } from "next/navigation";

const ReviewBlogPage = async ({ params }: { params: { slug: string } }) => {
  let blog;
  try {
    blog = await getBlogById(params.slug);
  } catch (error) {
    redirect("/admin/my-blogs");
  }
  return <ReviewBlog detail={blog} />;
};

export default ReviewBlogPage;
