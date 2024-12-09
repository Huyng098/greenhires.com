import { Category } from "@/interfaces/general/category";
import { SampleDto } from "@/interfaces/sample/sample";
import CanvaFramesConsultant from "@/modules/Consultant/Canva/CanvaFramesConsultant";
import { getAllCategories } from "@/services/general/api";
import { getSampleById } from "@/services/sample/api";
import { redirect } from "next/navigation";

export default async function CanvaPageConsultant({
  params,
}: {
  params: { slug: string[] };
}) {
  let allCategories: Category[];
  let sample: SampleDto;
  try {
    allCategories = await getAllCategories();
    const id = params.slug[0];
    sample = await getSampleById(id);
    console.log(sample);
  } catch (error) {
    redirect("/consultant/dashboard");
  }
  return <CanvaFramesConsultant categories={allCategories} sample={sample} />;
}
