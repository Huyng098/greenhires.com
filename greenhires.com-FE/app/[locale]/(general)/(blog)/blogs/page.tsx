import ListBlog from "@/modules/Blog/listBlog";
import { getAllCategories } from "@/services/general/api";

const BlogPage = async () => {
  const categories = await getAllCategories("blog");
  return <ListBlog categories={categories} />;
};

export default BlogPage;
