"use client";
import { RichInput } from "@/components/controls/texteditor";
import { useResumeCRUD } from "@/lib/hooks/useResume";
import { useResumeStore } from "@/stores/resume";
import { SectionResumeTitle } from "../Shared/section-title";

export const AboutMe = () => {
  const { updateBasics } = useResumeCRUD({
    component: "sections.aboutme",
  });
  const aboutme = useResumeStore()(
    (state) => state.resume.resume_data?.sections?.aboutme 
  ) || {};
  const setValue = useResumeStore()((state) => state.setResume);
  return (
    <div id="aboutme">
      <SectionResumeTitle
        identifier="aboutme"
        section={aboutme as any}
        setValue={setValue}
      />
      <div className="mt-2" />
      <RichInput
        content={aboutme?.content}
        topic="About Me"
        id="sections.aboutme.content"
        className="min-h-[160px]"
        onChange={(value) => updateBasics("sections.aboutme.content", value)}
      />
    </div>
  );
};
