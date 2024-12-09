"use client";
import { useScopedI18n } from "@/config/i18n/client";
import { SectionItem, SectionKey } from "@/interfaces/builder/baseSection";
import { useResumeCRUD } from "@/lib/hooks/useResume";

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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { getComponent, getDefaultValues } from "./get-component";
import { SectionListItem } from "./section-item";
// @ts-ignore
import get from "lodash.get";
import { SectionResumeTitle } from "./section-title";
import { cn } from "@/lib/utils";

type Props<T extends SectionItem> = {
  identifier: SectionKey;
  title: (item: T) => string;
  description?: (item: T) => string | undefined;
};

export const SectionBase = <T extends SectionItem>({
  identifier,
  title,
  description,
}: Props<T>) => {
  const {
    section,
    setValue,
    createOrDuplicateItem,
    updateFieldItem,
    deleteItem,
    deleteCustomSection,
  } = useResumeCRUD({
    component: identifier,
  });

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: identifier,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const scopedT = useScopedI18n(
    (identifier.startsWith("custom.") ? "custom" : identifier) as
      | "education"
      | "skills"
      | "languages"
      | "awards"
      | "hobbies"
      | "courses"
      | "certifications"
      | "references"
      | "projects"
      | "experience"
  );

  if (!section) return null;

  const style: React.CSSProperties = {
    position: "relative",
    backgroundColor: "#f0f9ff",
    transform: CSS.Transform.toString(
      transform
        ? {
            ...transform,
            scaleX: 1,
            scaleY: 1,
          }
        : null
    ),
    zIndex: isDragging ? 100 : undefined,
    transition,
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = section.items.findIndex((item) => item.id === active.id);
      const newIndex = section.items.findIndex((item) => item.id === over.id);

      const sortedList = arrayMove(section.items as T[], oldIndex, newIndex);
      setValue(`sections.${identifier}.items`, sortedList);
    }
  };

  const onToggleVisibilityItem = (index: number) => {
    const visible = get(section, `items[${index}].visible`, true);
    setValue(`sections.${identifier}.items[${index}].visible`, !visible);
  };

  const onDelete = (item: T) => {
    deleteItem(identifier, item.id);
  };

  const onDuplicate = (item: T) => {
    createOrDuplicateItem(item);
  };
  const handleDeleteCustomSection = () => {
    deleteCustomSection(identifier);
  };

  const onCreate = () => {
    const item = getDefaultValues(identifier) as T;
    createOrDuplicateItem(item);
  };

  return (
    <motion.section
      ref={setNodeRef}
      id={identifier}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        backgroundColor: "#f0f9ff",
      }}
    >
      <div
        className={cn(
          "before:absolute before:-inset-x-4 before:shadow-lg after:absolute after:inset-0 after:bg-[#f0f9ff] after:opacity-40",
          !isDragging && "before:hidden after:hidden"
        )}
        style={style}
      >
        <SectionResumeTitle
          identifier={identifier}
          section={section}
          setValue={setValue}
          handleDeleteCustomSection={handleDeleteCustomSection}
          listeners={listeners}
          attributes={attributes}
        />
        <div
          style={{
            maxHeight: isDragging ? "200px" : undefined,
            overflow: isDragging ? "hidden" : undefined,
          }}
        >
          <main className={classNames(!section?.visible && "opacity-50")}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToParentElement]}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={section.items}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence>
                  {section.items?.map((item, index) => (
                    <SectionListItem
                      id={item.id}
                      visible={item.visible}
                      title={title(item as T)}
                      description={description?.(item as T)}
                      onToggleVisibility={() => onToggleVisibilityItem(index)}
                      onDelete={() => onDelete(item as T)}
                      onDuplicate={() => onDuplicate(item as T)}
                      key={item.id}
                    >
                      {getComponent(identifier, item, updateFieldItem, scopedT)}
                    </SectionListItem>
                  ))}
                </AnimatePresence>
              </SortableContext>
            </DndContext>
          </main>
          <button
            onClick={onCreate}
            style={{ textTransform: "none" }}
            className="w-full p-2 flex justify-start hover:bg-sky-100"
          >
            <AddCircleOutlineIcon color="primary" />
            <p className="ml-2 text-[#1976d2]">Add</p>
          </button>
        </div>
      </div>
    </motion.section>
  );
};
