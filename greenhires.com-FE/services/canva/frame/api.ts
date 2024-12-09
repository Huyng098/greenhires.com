"use server";
import { SAMPLE } from "@/constants/apis";
import { FrameDto } from "@/interfaces/builder/resume";
import { http } from "@/utils/http";

export const getAllFrames = async (): Promise<FrameDto[]> => {
  return await http.get(`${SAMPLE.FRAME}`, undefined, false);
};
