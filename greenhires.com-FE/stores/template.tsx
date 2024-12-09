"use client";
import { ResumeData } from "@/interfaces/builder/resume";
import { createContext, useState } from "react";

export type TemplateContextType = {
  templateId: string;
  setTemplateId: (template_id: string) => void;
  templateVariant: string;
  setTemplateVariant: (template_variant: string) => void;
  typeOfBuilder: "resumeio" | "resumecanva";
  setTypeOfBuilder: (typesofBuilder: "resumeio" | "resumecanva") => void;
  typeOfCV: "resume" | "cover-letter" | undefined;
  setTypeOfCV: (typeOfCV: "resume" | "cover-letter" | undefined) => void;
  resume_data: ResumeData;
  setResumeData: (data: ResumeData) => void;
};

export const TemplateContext = createContext<TemplateContextType>(
  {} as TemplateContextType
);

export const TemplateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [templateId, setTemplateId] = useState("");
  const [templateVariant, setTemplateVariant] = useState("");
  const [typeOfBuilder, setTypeOfBuilder] = useState<
    "resumeio" | "resumecanva"
  >("resumeio");
  const [typeOfCV, setTypeOfCV] = useState<
    "resume" | "cover-letter" | undefined
  >("resume");

  const [resume_data, setResumeData] = useState<ResumeData>();

  return (
    <TemplateContext.Provider
      value={{
        templateId,
        setTemplateId,
        templateVariant,
        setTemplateVariant,
        typeOfBuilder,
        setTypeOfBuilder,
        typeOfCV,
        setTypeOfCV,
        resume_data,
        setResumeData,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};
