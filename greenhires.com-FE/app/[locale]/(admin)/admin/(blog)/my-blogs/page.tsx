import { UserRole } from "@/interfaces/user";
import BlogsTable from "@/modules/Admin/Blog/BlogsTable";
import { getAllCategories } from "@/services/general/api";
import { getCookie } from "@/utils/cookie/getCookie";

export default async function AdminMyBlogsPage() {
  const categories = await getAllCategories("blog");
  const role = getCookie("role") as UserRole;
  return (
    <BlogsTable
      categories={categories}
      restrict="my"
      typeButton="edit"
      role={role}
    />
  );
}
