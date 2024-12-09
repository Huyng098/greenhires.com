import UploadBackground from "@/modules/Background/BackgroundImage";
import { getAllCategories } from "@/services/general/api";

export default async function UploadBackgroundImage() {
  const categories = await getAllCategories("resume");
  return <UploadBackground categories={categories} />;
}
