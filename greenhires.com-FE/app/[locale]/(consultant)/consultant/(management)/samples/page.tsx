import ListTemplateTable from "@/modules/Admin/ListTemplatesTable/ListTemplatesTable";
import { getAllCategories } from "@/services/general/api";
import { getCookie } from "@/utils/cookie/getCookie";

export default async function TemplateConsultantPage() {
  const categories = await getAllCategories("resume");
  const role = getCookie("role");
  const restrict = "my";
  return (
    <div className="flex flex-col gap-6 py-16 px-8 w-full bg-[#f7f9fb]">
      <p className="font-medium text-xl mt-5">
        {restrict === "my" ? "My Samples" : "Review"}
      </p>
      <div className=" bg-white rounded-lg">
        <ListTemplateTable
          categories={categories}
          role={role}
          restrict={restrict}
          typeButton="edit"
        />
      </div>
    </div>
  );
}
