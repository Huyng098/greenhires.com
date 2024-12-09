import { ResumeDto } from "@/interfaces/builder/resume";
import { Category } from "@/interfaces/general/category";
import { SampleDto } from "@/interfaces/sample/sample";
import BuilderComponent from "@/modules/Builder/BuilderComponent";
import { getAllCategories } from "@/services/general/api";
import { getSampleById } from "@/services/sample/api";
import ResumeProvider from "@/stores/resume";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function BuilderPage({
  params,
}: {
  params: { slug: string[] };
}) {
  let resume: SampleDto & ResumeDto;
  let categories: Category[];
  try {
    const id = params.slug[0];
    resume = await getSampleById(id);
    console.log("resume" + resume)
    categories = await getAllCategories();
  } catch {
    redirect("consultant/dashboard");
  }
  const layout = cookies().get("react-resizable-panels:layout");
  let defaultLayout = [45, 55];
  if (layout) {
    defaultLayout = JSON.parse(layout.value);
  }

  return (
    <ResumeProvider resume={{ ...resume, isSample: true }}>
      <BuilderComponent
        resizableLayout={defaultLayout}
        categories={categories}
        pathname={params.slug[1]}
      />
    </ResumeProvider>
  );
}
