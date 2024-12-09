import ApproveForm from "@/modules/Admin/Template/ApproveForm";
import PreviewSample from "@/modules/Admin/Template/PreviewSample";
import { getSampleById } from "@/services/sample/api";
import dayjs from "dayjs";

export default async function ReviewTemplatePage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getSampleById(params.slug);

  return (
    <>
      <div className="flex flex-col gap-6 py-16 px-8 w-full bg-[#f7f9fb]">
        <p className="font-bold text-2xl">Review</p>
        <div className="pt-10 bg-white rounded-lg px-14 pb-5 ">
          <p className="font-bold text-2xl">{data.name}</p>
          <div className="flex gap-8 my-2">
            <p className="font-medium text-[#848484]">
              {`Updated at ${dayjs(data.updated_at).format("MMMM D, YYYY")}`}
            </p>
            <p className="font-medium text-[#848484]">
              <li>{data.creator_name}</li>
            </p>
          </div>
          <div className="flex gap-5 ">
            <p className="bg-[#E1F9E0] text-[#098C36] px-6 py-2 rounded-lg font-medium">
              {`${data.type.toUpperCase()}`}
            </p>
            <p className="bg-[#DDF8FA] text-[#1457BB] px-6 py-2 rounded-lg font-medium">
              {`${data.category_names
                ?.map((category) => category)
                .join(", ")
                .toUpperCase()}`}
            </p>
          </div>
          <PreviewSample data={data.elements} variants={data.variants} />
        </div>
        <ApproveForm type={data.type} sample_id={params.slug} />
      </div>
    </>
  );
}
