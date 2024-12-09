import { UserRole } from "@/interfaces/user";
import BlogForm from "@/modules/Blog/blogForm";
import { getBlogById } from "@/services/blog/api";
import { getAllCategories } from "@/services/general/api";
import { getCookie } from "@/utils/cookie/getCookie";
import { redirect } from "next/navigation";

const EditBlogPage = async ({ params }: { params: { slug: string } }) => {
  const categories = await getAllCategories("blog");
  let blog;

  try {
    blog = await getBlogById(params.slug);
    const role = getCookie("role") as UserRole;
    if (!blog?.id) {
      if (role === "admin" || role === "superadmin") {
        redirect("/admin/my-blogs");
      } else if (role === "consultant") {
        redirect("/consultant/blogs/my-blogs");
      }
    }
  } catch (error) {
    redirect("/internal/signin");
  }
  const role = getCookie("role") as UserRole;

  return <BlogForm categories={categories} detail={blog} role={role} />;
};

export default EditBlogPage;
