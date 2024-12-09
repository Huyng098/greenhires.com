import { Category } from "@/interfaces/general/category";
import AllResumeIOTemplates from "@/modules/Template/resumeio-templates";
import { getAllCategories } from "@/services/general/api";

export default async function ChooseTemplatePage() {
  let allCategories: Category[];
  try {
    allCategories = await getAllCategories();
  } catch (error) {
    console.error(error);
    allCategories = [];
  }

  return (
    <div className="flex flex-col pt-10 gap-5 justify-center items-center text-primary-main">
      <h1 className="text-3xl font-bold">Choose Your Templates</h1>
      <AllResumeIOTemplates categories={allCategories} />
    </div>
  );
}
