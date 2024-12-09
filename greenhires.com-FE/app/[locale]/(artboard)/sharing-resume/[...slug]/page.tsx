"use client";
import { Loading } from "@/components/Common/Loading";
import { Frame } from "@/lib/design-screen";
import { useResumePublicView } from "@/services/resume/query";
import { redirect } from "next/navigation";

export default function PublicResumePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const username = params.slug[0];
  const cv_slug = params.slug[1];
  const { resume, isError, isPending } = useResumePublicView({
    username: username,
    slug: cv_slug,
  });
  if (isError) redirect("/");
  return isPending ? (
    <div className="flex justify-center items-center">
      <Loading color="white" />
    </div>
  ) : (
    <Frame data={resume!.resume_canva} width={794} height={1123} />
  );
}
