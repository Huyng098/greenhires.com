import SampleDashBoard from "@/modules/Consultant/SampleDashboard";
import { getAllCategories } from "@/services/general/api";

export default async function DashboardConsultantPage() {
  const categories = await getAllCategories("resume");
  return <SampleDashBoard categories={categories} />;
}
