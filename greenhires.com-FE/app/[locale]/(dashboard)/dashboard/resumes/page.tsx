import { MY_RESUMES_KEY } from "@/constants/query_key";
import { getQueryClient } from "@/lib/queryClient";
import MyResumes from "@/modules/Dashboard/Resumes";
import { getAllResumes } from "@/services/resume/api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ResumesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: MY_RESUMES_KEY,
    queryFn: async () => await getAllResumes("resume"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyResumes />;
    </HydrationBoundary>
  );
}
