import { ResumeDto } from "@/interfaces/builder/resume";
import { Category } from "@/interfaces/general/category";
import CanvaFrames from "@/modules/Canva";
import { getAllCategories } from "@/services/general/api";

import { fetchResumeById } from "@/services/resume/api";
import ResumeProvider from "@/stores/resume";
import { redirect } from "next/navigation";

export default async function CanvaPage({
  params,
}: {
  params: { slug: string[] };
}) {
  let allCategories: Category[];
  let resume: ResumeDto;
  try {
    allCategories = await getAllCategories();
    const id = params.slug[0];
    resume = await fetchResumeById(id);
  } catch (error) {
    redirect("/dashboard/resumes");
  }
  return (
    <ResumeProvider resume={resume}>
      <CanvaFrames categories={allCategories} />
    </ResumeProvider>
  );
}
