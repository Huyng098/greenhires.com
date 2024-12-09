import ListTemplateTable from "@/modules/Admin/ListTemplatesTable/ListTemplatesTable";
import { getAllCategories } from "@/services/general/api";
import { getCookie } from "@/utils/cookie/getCookie";

export default async function TemplatesPage() {
  const categories = await getAllCategories("resume");
  const role = getCookie("role");
  return (
    <div className="flex flex-col gap-6 py-16 px-8 w-full bg-[#f7f9fb]">
      <p className="font-bold text-2xl">Review</p>
      <div className=" bg-white rounded-lg">
        <ListTemplateTable
          categories={categories}
          restrict="all"
          role={role}
          typeButton="review"
        />
      </div>
    </div>
  );
}
