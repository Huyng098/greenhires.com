import {
  Award as AwardType,
  Certification as CertificationType,
  Course as CourseType,
  CustomSection as CustomSectionType,
  Education as EducationType,
  Experience as ExperienceType,
  Hobby as HobbiesType,
  Language as LanguageType,
  Reference as ReferenceType,
  Skill as SkillType,
  URL as URLType,
  awardDefault,
  certificationDefault,
  courseDefault,
  customSectionDefault,
  educationDefault,
  experienceDefault,
  hobbyDefault,
  languageDefault,
  referenceDefault,
  skillDefault,
} from "@/interfaces/builder";
import { SectionItem } from "@/interfaces/builder/baseSection";
import { Award } from "../SidebarLeft/award";
import { Certification } from "../SidebarLeft/certification";
import Course from "../SidebarLeft/course";
import CustomSection from "../SidebarLeft/customSection";
import { Education } from "../SidebarLeft/education";
import { Experience } from "../SidebarLeft/experience";
import Hobby from "../SidebarLeft/hobby";
import { Language } from "../SidebarLeft/language";
import LinkSection from "../SidebarLeft/link";
import Reference from "../SidebarLeft/reference";
import { Skill } from "../SidebarLeft/skill";

export const getComponent = <T extends SectionItem>(
  keyword: string,
  item: T,
  updateFieldItem: (id: string, attribute: string, value: unknown) => void,
  scopedT: any
) => {
  switch (keyword) {
    case "awards":
      return Award({ item: item as AwardType, updateFieldItem, scopedT });
    case "education":
      return Education({
        item: item as EducationType,
        updateFieldItem,
        scopedT,
      });
    case "experience":
      return Experience({
        item: item as ExperienceType,
        updateFieldItem,
        scopedT,
      });
    case "languages":
      return Language({ item: item as LanguageType, updateFieldItem, scopedT });
    case "skills":
      return Skill({ item: item as SkillType, updateFieldItem, scopedT });
    case "courses":
      return Course({ item: item as CourseType, updateFieldItem, scopedT });
    case "hobbies":
      return Hobby({ item: item as HobbiesType, updateFieldItem, scopedT });
    case "certifications":
      return Certification({
        item: item as CertificationType,
        updateFieldItem,
        scopedT,
      });
    case "references":
      return Reference({
        item: item as ReferenceType,
        updateFieldItem,
        scopedT,
      });
    case "links":
      return LinkSection({ item: item as URLType, updateFieldItem, scopedT });
    default:
      if (keyword.startsWith("custom.")) {
        return CustomSection({
          item: item as CustomSectionType,
          updateFieldItem,
          scopedT,
        });
      }
      return null;
  }
};

export const getDefaultValues = (keyword: string) => {
  switch (keyword) {
    case "awards":
      return awardDefault;
    case "education":
      return educationDefault;
    case "experience":
      return experienceDefault;
    case "languages":
      return languageDefault;
    case "skills":
      return skillDefault;
    case "courses":
      return courseDefault;
    case "hobbies":
      return hobbyDefault;
    case "certifications":
      return certificationDefault;
    case "references":
      return referenceDefault;

    default:
      if (keyword.startsWith("custom.")) {
        return customSectionDefault;
      }
      return null;
  }
};
