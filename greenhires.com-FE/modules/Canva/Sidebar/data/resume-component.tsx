import { SerializedLayerTree } from "@lidojs/design-core";
import {
  BookBookmark,
  Briefcase,
  Certificate,
  FlowerTulip,
  Football,
  GraduationCap,
  Info,
  Note,
  ThumbsUp,
  Translate,
  Trophy,
  UserCircle,
} from "@phosphor-icons/react";
import { ReactElement } from "react";
import { AboutMeComponent, AboutMeLayout } from "./resume/aboutme";
import { AwardComponent, AwardLayout } from "./resume/award";
import {
  BasicsComponent,
  BasicsLayout,
  PictureComponent,
  PictureLayout,
} from "./resume/basics";
import {
  CertificationComponent,
  CertificationLayout,
} from "./resume/certification";
import { CourseComponent, CourseLayout } from "./resume/course";
import { EducationComponent, EducationLayout } from "./resume/education";
import { ExperienceComponent, ExperienceLayout } from "./resume/experience";
import { HobbyComponent, HobbyLayout } from "./resume/hobby";
import { LanguageComponent, LanguageLayout } from "./resume/language";
import { ReferenceComponent, ReferenceLayout } from "./resume/reference";
import { SkillComponent, SkillLayout } from "./resume/skill";

export type SectionType =
  | "aboutme"
  | "education"
  | "basics"
  | "basics.picture"
  | "experience"
  | "skills"
  | "languages"
  | "courses"
  | "hobbies"
  | "certifications"
  | "awards"
  | "references"
  | "customsection";

export type Section = {
  type: SectionType;
  label: string;
  icon: ReactElement;
  component: SerializedLayerTree[];
  layout: SerializedLayerTree;
};

export const components: Section[] = [
  {
    type: "basics",
    label: "Basics",
    icon: <Info size={32} />,
    component: BasicsComponent,
    layout: BasicsLayout,
  },
  {
    type: "basics.picture",
    label: "Picture",
    icon: <UserCircle size={32} />,
    component: PictureComponent,
    layout: PictureLayout,
  },
  {
    type: "aboutme",
    label: "About me",
    icon: <FlowerTulip size={32} />,
    component: AboutMeComponent,
    layout: AboutMeLayout,
  },
  {
    type: "education",
    label: "Education",
    icon: <GraduationCap size={32} />,
    component: EducationComponent,
    layout: EducationLayout,
  },
  {
    type: "experience",
    label: "Experience",
    icon: <Briefcase size={32} />,
    component: ExperienceComponent,
    layout: ExperienceLayout,
  },
  {
    type: "skills",
    label: "Skill",
    icon: <ThumbsUp size={32} />,
    component: SkillComponent,
    layout: SkillLayout,
  },
  {
    type: "languages",
    label: "Language",
    icon: <Translate size={32} />,
    component: LanguageComponent,
    layout: LanguageLayout,
  },
  {
    type: "awards",
    label: "Award",
    icon: <Trophy size={32} />,
    component: AwardComponent,
    layout: AwardLayout,
  },
];

export const moreComponents: Section[] = [
  {
    type: "courses",
    label: "Course",
    icon: <BookBookmark size={32} />,
    component: CourseComponent,
    layout: CourseLayout,
  },
  {
    type: "hobbies",
    label: "Hobby",
    icon: <Football size={32} />,
    component: HobbyComponent,
    layout: HobbyLayout,
  },
  {
    type: "certifications",
    label: "Certification",
    icon: <Certificate size={32} />,
    component: CertificationComponent,
    layout: CertificationLayout,
  },
  {
    type: "references",
    label: "Reference",
    icon: <Note size={32} />,
    component: ReferenceComponent,
    layout: ReferenceLayout,
  },
  /*{
    type: "customsection",
    label: "Custom Section",
    icon: <NotePencil size={32} />,
    component: CustomSectionComponent,
    layout: CustomSectionLayout,
  },*/
];
