"use server";
import { SAMPLE } from "@/constants/apis";
import { SAMPLE_TYPES } from "@/constants/dashboard";
import { ErrorResponse } from "@/interfaces/base";
import { ResumeDto, URLSchema } from "@/interfaces/builder/resume";
import { PaginatedResponse } from "@/interfaces/general/pagination";
import { SampleDto, SampleVariant } from "@/interfaces/sample/sample";
import { http } from "@/utils/http";
import { SerializedPage } from "@lidojs/design-core";
import { format } from "date-fns";
import { revalidateTag } from "next/cache";
import qs from "query-string";

export const getAllSamples = async (
  page: number,
  limit: number,
  status?: string,
  start_date?: Date,
  end_date?: Date,
  category_id?: string,
  restrict?: "all" | "my",
  type?: SAMPLE_TYPES
): Promise<PaginatedResponse<SampleDto>> => {
  const query_str = qs.stringify(
    {
      page,
      limit,
      status,
      start_date: start_date ? format(start_date, "yyyy-MM-dd") : undefined,
      end_date: end_date ? format(end_date, "yyyy-MM-dd") : undefined,
      category_id,
      restrict: restrict,
      type,
    },
    { skipNull: true, skipEmptyString: true }
  );
  return await http.get(`${SAMPLE.ALL}?${query_str}`, undefined, true);
};

export const getSampleById = async (
  id: string
): Promise<SampleDto & ResumeDto> => {
  return await http.get(
    `${SAMPLE.GET_BY_ID(id)}`,
    { next: { tags: [`sample_id: ${id}`] } },
    true
  );
};

export const replaceVariant = async ({
  sample_id,
  colors,
}: {
  sample_id: string;
  colors: string[];
}): Promise<SampleVariant[] | ErrorResponse> => {
  return await http.post(
    `${SAMPLE.REPLACE_VARIANT(sample_id)}`,
    {
      colors,
    },
    undefined,
    true
  );
};

export const changeSampleStatus = async ({
  id,
  status,
  category_ids,
  comment,
}: {
  id: string;
  status?: string;
  category_ids?: string[];
  comment?: string;
}): Promise<SampleDto | ErrorResponse> => {
  return await http.put(
    `${SAMPLE.CHANGE_STATUS(id)}`,
    { status, category_ids, comment },
    undefined,
    true
  );
};

export const deleteSampleById = async (
  id: string
): Promise<SampleDto | ErrorResponse> => {
  return await http.delete(`${SAMPLE.DELETE}/${id}`, undefined, true);
};

export const duplicateSampleById = async ({
  sample_id,
  name,
}: {
  sample_id: string;
  name: string;
}): Promise<SampleDto | ErrorResponse> => {
  revalidateTag("samples");
  return await http.post(
    `${SAMPLE.DUPLICATE}`,
    {
      sample_id,
      name,
    },
    undefined,
    true
  );
};

export const addSample = async ({
  title,
  type,
  resume_data,
  resume_canva,
}: {
  title: string;
  type: string;
  resume_data?: unknown;
  resume_canva?: unknown;
}): Promise<SampleDto | ErrorResponse> => {
  const sampleDto = {
    summary: "",
    name: title,
    type: type,
    resume_data,
    resume_canva: resume_canva || [
      {
        layers: {
          ROOT: {
            type: { resolvedName: "RootLayer" },
            props: {
              boxSize: { width: 794, height: 1123 },
              position: { x: 0, y: 0 },
              rotate: 0,
              color: "rgb(255, 255, 255)",
              image: null,
            },
            locked: false,
            child: [],
            parent: null,
          },
        },
      },
    ],
  };
  return await http.post(`${SAMPLE.ADD}`, sampleDto, undefined, true);
};

export const updateSampleById = async ({
  id,
  name,
  resume_canva,
}: {
  id: string;
  name?: string;
  resume_canva?: SerializedPage[];
}): Promise<SampleDto> => {
  if (resume_canva) {
    for (const layerId in resume_canva[0].layers) {
      const layer = resume_canva[0].layers[layerId];
      if (
        layer.type &&
        (layer.type.resolvedName === undefined ||
          layer.type.resolvedName === "$undefined")
      ) {
        layer.type.resolvedName = "ROOT"; // Thay thế bằng tên mới
      }
    }
  }

  return await http.patch(
    `${SAMPLE.UPDATE(id)}`,
    { resume_canva, name },
    undefined,
    true
  );
};

export const exportSample = async (data: {
  id: string;
  format: string;
}): Promise<URLSchema> => {
  return await http.get(SAMPLE.EXPORT(data.id), undefined, true);
};
