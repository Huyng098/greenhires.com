import DetailBlog from "@/modules/Blog/detailBlog";
import { getBlogById, getRelatedBlogs } from "@/services/blog/api";
import { redirect } from "next/navigation";

const DetailBlogPage = async ({ params }: { params: { slug: string } }) => {
  let blog;
  let relatedBlogs;
  try {
    blog = await getBlogById(params.slug);
    relatedBlogs = await getRelatedBlogs(blog.id, 5);
  } catch (error) {
    redirect("/blogs");
  }

  return <DetailBlog detail={blog} relatedBlogs={relatedBlogs} />;
};

export default DetailBlogPage;
