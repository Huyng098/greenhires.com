"use server";

import { GENERAL, RESUME, SAMPLE } from "@/constants/apis";
import { defaultResumeCanva, getDefaultResumeCanva } from "@/constants/canva";
import { TEMPLATE_LAYOUT, TYPE } from "@/constants/dashboard";
import { ErrorResponse } from "@/interfaces/base";
import {
  PublicViewResume,
  ResumeAvatarForm,
  ResumeCreate,
  ResumeData,
  ResumeDto,
  URLSchema,
  requiredDefaultResumeData,
} from "@/interfaces/builder/resume";
import { http } from "@/utils/http";

export const createResume = async (
  resume_create: ResumeCreate
): Promise<ResumeDto | ErrorResponse> => {
  const resume_data = resume_create?.resume_data || requiredDefaultResumeData;
  if (resume_create.typeOfBuilder === "resumeio") {
    if (resume_create.templateId)
      resume_data.metadata.template = resume_create.templateId;
    if (resume_create.templateVariant && resume_create.templateVariant !== "")
      resume_data.metadata.variant = resume_create.templateVariant;
  }
  const body = {
    title: resume_create.title,
    resume_data: resume_data,
    resume_canva: resume_create.templateId
      ? getDefaultResumeCanva(0)
      : defaultResumeCanva,
    builder_type: resume_create.typeOfBuilder,
    type: resume_create.type,
  };
  return await http.post(RESUME.CREATE_FROM_SCRATCH, body, undefined, true);
};

export const createResumeFromLinkedin = async (
  formData: FormData
): Promise<ResumeDto | ErrorResponse> => {
  return await http.post(
    RESUME.CREATE_FROM_LINKEDIN,
    formData,
    {
      headers: {},
    },
    true
  );
};
export const getAllResumes = async (type: TYPE): Promise<ResumeDto[]> => {
  return await http.get(RESUME.MINES(type), undefined, true);
};

export const fetchResumeById = async (id: string): Promise<ResumeDto> => {
  return await http.get(RESUME.DETAIL(id), undefined, true);
};

export const fetchResumeByUsernameSlug = async ({
  username,
  slug,
}: PublicViewResume): Promise<ResumeDto> => {
  return await http.get(RESUME.SHARE(username, slug), undefined, false);
};

export const updateResume = async (data: any): Promise<ResumeDto> => {
  const url =
    data?.type === TEMPLATE_LAYOUT
      ? SAMPLE.UPDATE(data.id)
      : RESUME.DETAIL(data.id);
  for (const layerId in data.resume_canva[0].layers) {
    const layer = data.resume_canva[0].layers[layerId];
    if (
      layer.type &&
      (layer.type.resolvedName === undefined ||
        layer.type.resolvedName === "$undefined")
    ) {
      layer.type.resolvedName = "ROOT"; // Thay thế bằng tên mới
    }
  }
  
  return await http.patch(url, data, undefined, true);
};

export const uploadResumeAvatar = async (
  avatar: ResumeAvatarForm
): Promise<URLSchema> => {
  const formData = new FormData();

  await fetch(avatar.imgSrc)
    .then((r) => r.blob())
    .then((blob): void => {
      const file = new File([blob], "resume_avatar.png");
      formData.append("image", file);
    });
  formData.append("type", "resume");
  formData.append("resume_id", avatar.resume_id);
  return await http.post(
    GENERAL.IMAGE,
    formData,
    {
      headers: {},
    },
    true
  );
};

export const deleteResume = async (id: string): Promise<ResumeDto> => {
  return await http.delete(RESUME.DETAIL(id), undefined, true);
};

export const duplicateResume = async ({
  resume_id,
  title,
}: {
  resume_id: string;
  title: string;
}): Promise<ResumeDto | ErrorResponse> => {
  return await http.post(RESUME.IMPORT, { resume_id, title }, undefined, true);
};

export const exportResume = async (data: {
  id: string;
  format: string;
}): Promise<URLSchema> => {
  return await http.get(RESUME.EXPORT(data.id, data.format), undefined, true);
};

export const previewResume = async (id: string): Promise<URLSchema> => {
  return await http.get(RESUME.PREVIEW(id), undefined, true);
};

export const parseResume = async (formData: FormData): Promise<ResumeData> => {
  return await http.post(
    `${RESUME.PARSING}`,
    formData,
    {
      headers: {},
    },
    true
  );
};
