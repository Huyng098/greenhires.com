import BlogsTable from "@/modules/Admin/Blog/BlogsTable";
import { getAllCategories } from "@/services/general/api";

export default async function BlogsPage() {
  const categories = await getAllCategories("blog");
  return <BlogsTable categories={categories} />;
}
