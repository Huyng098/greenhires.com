"use client";

import { useResumeStore } from "@/stores/resume";
import { DesignFrame } from "../../../lib/design-editor";

const EditorContent = () => {
  const resume_canva = useResumeStore()((state) => state.resume?.resume_canva);
  return <DesignFrame data={resume_canva} />;
};

export default EditorContent;
