import { useEditor } from "@/lib/design-editor";
import { FC } from "react";
import { SectionLayout } from "./data/component-layout";
import { Section } from "./data/resume-component";

export const SectionContent: FC = () => {
  const { actions } = useEditor();
  const addSection = (section: Section) => {
    actions.addSectionLayer(section);
  };

  const addLayout = (section: Section) => {
    actions.addLayoutLayer(section);
  };

  return (
    <>
      <SectionLayout title="Component" onClick={addSection} />
      {/*<SectionLayout title="Layout" onClick={addLayout} />*/}
    </>
  );
};
