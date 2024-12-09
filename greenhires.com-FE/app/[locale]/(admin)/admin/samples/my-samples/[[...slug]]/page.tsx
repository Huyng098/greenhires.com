import ListTemplateTable from "@/modules/Admin/ListTemplatesTable/ListTemplatesTable";
import { getAllCategories } from "@/services/general/api";
import { getCookie } from "@/utils/cookie/getCookie";

export default async function MyTemplatesPage() {
  const categories = await getAllCategories("resume");
  const restrict = "my";
  const typeButton = "edit";
  const role = getCookie("role");
  return (
    <div className="flex flex-col gap-6 py-16 px-8 w-full bg-[#f7f9fb]">
      <p className="font-medium text-xl">My Samples</p>
      <div className=" bg-white rounded-lg">
        <ListTemplateTable
          categories={categories}
          restrict={restrict}
          typeButton={typeButton}
          role={role}
        />
      </div>
    </div>
  );
}
