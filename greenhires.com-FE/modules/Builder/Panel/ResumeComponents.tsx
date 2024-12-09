"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Award as AwardType,
  Certification as CertificationType,
  Course as CourseType,
  CustomSection as CustomSectionType,
  Education as EducationType,
  Experience as ExperienceType,
  Hobby as HobbyType,
  Language as LanguageType,
  Reference as ReferenceType,
  Skill as SkillType,
  URL as URLType,
} from "@/interfaces/builder";
import { Category } from "@/interfaces/general/category";
import { useBuilderStore } from "@/stores/builder";
import { useResumeStore } from "@/stores/resume";
import { X } from "@phosphor-icons/react/dist/ssr";
import { Fragment } from "react";
import { Panel } from "react-resizable-panels";
import EditAvatar from "../EditAvatar/EditAvatar";
import { SectionBase } from "../Shared/section-base";
import { AboutMe } from "../SidebarLeft/aboutMe";
import { AddSection } from "../SidebarLeft/addSection";
import { PersonalDetail } from "../SidebarLeft/basics";
import { ApplyBackground } from "../SidebarRight/apply-background";
import { ApplyTemplate } from "../SidebarRight/apply-template";
import { ResumeTitle } from "./ResumeTitle";

import { GlobalRichInput } from "@/components/controls/global-texteditor";
import { useEditor } from "@/lib/design-editor";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import ShapeContent from "../SidebarLeft/Shape/ShapeContent";
import LayoutSectionStyle from "../SidebarRight/layout-section-style";

export const getSection = (identifier: string) => {
  if (identifier.startsWith("custom."))
    return (
      <SectionBase<CustomSectionType>
        identifier={identifier as `custom.${string}`}
        title={(item) => item.name}
        description={(item) => item.summary}
      />
    );

  switch (identifier) {
    case "education":
      return (
        <SectionBase<EducationType>
          identifier="education"
          title={(item) => item.typeOfStudy}
          description={(item) => item.school}
        />
      );
    case "experience":
      return (
        <SectionBase<ExperienceType>
          identifier="experience"
          title={(item) => item.company}
          description={(item) => item.position}
        />
      );
    case "skills":
      return (
        <SectionBase<SkillType>
          identifier="skills"
          title={(item) => item.name}
          description={(item) => item.description}
        />
      );
    case "links":
      return (
        <SectionBase<URLType>
          identifier="links"
          title={(item) => item.label}
          description={(item) => item.href}
        />
      );
    case "languages":
      return (
        <SectionBase<LanguageType>
          identifier="languages"
          title={(item) => item.name}
          description={(item) => item.level}
        />
      );
    case "awards":
      return (
        <SectionBase<AwardType>
          identifier="awards"
          title={(item) => item.title}
          description={(item) => item.awarder}
        />
      );
    case "courses":
      return (
        <SectionBase<CourseType>
          identifier="courses"
          title={(item) => item.name}
          description={(item) => item.institution}
        />
      );
    case "hobbies":
      return (
        <SectionBase<HobbyType>
          identifier="hobbies"
          title={(item) => item.name}
          description={(item) => item.summary}
        />
      );
    case "certifications":
      return (
        <SectionBase<CertificationType>
          identifier="certifications"
          title={(item) => item.title}
          description={(item) => item.issuer}
        />
      );
    case "references":
      return (
        <SectionBase<ReferenceType>
          identifier="references"
          title={(item) => item.name}
          description={(item) => item.position}
        />
      );
    default:
      return null;
  }
};

export default function ResumeComponents({
  resizableLayout,
  categories,
}: {
  resizableLayout: number[];
  categories: Category[];
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sectionOrder = useResumeStore()(
    (state) => state.resume.resume_data?.metadata?.section_order
  );
  const setValue = useResumeStore()((state) => state.setResume);
  const isApplying = useBuilderStore()((state) => state.workspace.isApplying);
  const setIsApply = useBuilderStore()((state) => state.workspace.setIsApply);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = sectionOrder.findIndex((item) => item === active.id);
      const newIndex = sectionOrder.findIndex((item) => item === over.id);
      const sortedList = arrayMove(sectionOrder, oldIndex, newIndex);
      setValue("metadata.section_order", sortedList);
    }
  };
  const { sidebar } = useEditor((state) => ({
    sidebar: state.sidebar,
  }));
  return (
    <Panel
      id="resumeinfo-side"
      maxSize={60}
      defaultSize={resizableLayout[0]}
      minSize={30}
      className="relative"
    >
      <ScrollArea className="h-full">
        {sidebar && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 990,
            }}
            id={"settings"}
          />
        )}
        {isApplying === "none" ? (
          <div className="mx-12 mb-6 relative">
            <GlobalRichInput />
            <ResumeTitle />
            <EditAvatar />
            <PersonalDetail />
            <AboutMe />
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToParentElement]}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={sectionOrder || []}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence>
                    {sectionOrder?.map((section) => (
                      <Fragment key={section}>{getSection(section)}</Fragment>
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </DndContext>
            </motion.section>
            <AddSection />
          </div>
        ) : isApplying === "shape" ? (
          <div className="flex flex-col gap-3 items-center justify-center">
            <ShapeContent />
          </div>
        ) : isApplying === "template" ? (
          <>
            <div className="flex justify-end cursor-pointer hover:text-red-400 pr-4 pt-3">
              <X size={20} weight="light" onClick={() => setIsApply("none")} />
            </div>
            <ApplyTemplate categories={categories} size={26} />
          </>
        ) : isApplying === "layout" ? (
          <>
            <div className="flex justify-end cursor-pointer hover:text-red-400 pr-4 pt-3">
              <X size={20} weight="light" onClick={() => setIsApply("none")} />
            </div>
            <ApplyTemplate categories={categories} size={26} isLayout={true} />
          </>
        ) : isApplying === "layout-section-style" ? (
          <>
            <div className="flex justify-end cursor-pointer hover:text-red-400 pr-4 pt-3">
              <X size={20} weight="light" onClick={() => setIsApply("none")} />
            </div>
            <LayoutSectionStyle />
          </>
        ) : isApplying === "background" ? (
          <>
            <div className="flex justify-end cursor-pointer hover:text-red-400 pr-4 pt-3">
              <X size={20} weight="light" onClick={() => setIsApply("none")} />
            </div>
            <ApplyBackground categories={categories} />
          </>
        ) : (
          <></>
        )}
      </ScrollArea>
    </Panel>
  );
}
