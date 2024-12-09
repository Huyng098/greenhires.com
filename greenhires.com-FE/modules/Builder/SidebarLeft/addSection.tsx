"use client";

import { useI18n } from "@/config/i18n/client";
import { SectionKey } from "@/interfaces/builder/baseSection";
import { useResumeStore } from "@/stores/resume";
import { Button } from "@mui/material";
import {
  Aperture,
  Certificate,
  FlagCheckered,
  GraduationCap,
  Link,
  Plus,
} from "@phosphor-icons/react";
import { get } from "lodash";

interface Props {
  onClick: () => void;
  icon: React.ReactNode;
  label: "courses" | "hobbies" | "certifications" | "references" | "links";
  disabled: boolean;
}

const SectionButton = ({ onClick, icon, label, disabled }: Props) => {
  const t = useI18n();
  return (
    <Button
      variant="text"
      onClick={onClick}
      className="text-black"
      startIcon={icon}
      disabled={disabled}
    >
      {t(`addsection.${label}`)}
    </Button>
  );
};

export const AddSection = () => {
  const t = useI18n();
  const { resume, addCustomSection, addSectionByKey } = useResumeStore()(
    (state) => ({
      resume: state.resume?.resume_data?.sections,
      addCustomSection: state.addCustomSection,
      addSectionByKey: state.addSectionByKey,
    })
  );

  const sections = [
    {
      key: "courses",
      icon: <GraduationCap size={20} color="#418CDF" weight="light" />,
    },
    {
      key: "hobbies",
      icon: <Aperture size={20} color="#418CDF" weight="light" />,
    },
    {
      key: "certifications",
      icon: <Certificate size={20} color="#418CDF" weight="light" />,
    },
    {
      key: "references",
      icon: <FlagCheckered size={20} color="#418CDF" weight="light" />,
    },
    { key: "links", icon: <Link size={20} color="#418CDF" weight="light" /> },
  ];

  const handleClickOpen = (index: number) => {
    const key = sections[index]?.key;
    if (key) addSectionByKey(key as SectionKey);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xl font-medium mt-5 mb-2">
          {t("addsection.customsection")}
        </p>
        <button
          onClick={addCustomSection}
          className="flex hover:bg-slate-50 bg-white rounded-md items-center p-2 w-full border justify-center"
        >
          <Plus size={20} color="#0a0a0b" weight="light" />
          <p className="ml-2">{t("addsection.addnewcustomsection")}</p>
        </button>
      </div>
      <div>
        <p className="text-xl font-medium mb-2">{t("addsection.addsection")}</p>
        <div className="grid grid-cols-2 gap-5">
          {sections.map((section, index) => (
            <div key={section.key}>
              <SectionButton
                onClick={() => handleClickOpen(index)}
                icon={section.icon}
                label={
                  section.key as
                    | "courses"
                    | "hobbies"
                    | "certifications"
                    | "references"
                    | "links"
                }
                disabled={!!get(resume, section.key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
