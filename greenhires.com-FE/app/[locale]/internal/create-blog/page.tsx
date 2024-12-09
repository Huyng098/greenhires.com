import { UserRole } from "@/interfaces/user";
import BlogForm from "@/modules/Blog/blogForm";
import { getAllCategories } from "@/services/general/api";
import { getCookie } from "@/utils/cookie/getCookie";

const CreateBlogPage = async () => {
  const categories = await getAllCategories("blog");
  const role = getCookie("role") as UserRole;
  return <BlogForm categories={categories} role={role} />;
};

export default CreateBlogPage;
