"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Collapse } from "@mui/material";
import {
  CaretDown,
  CaretUp,
  DotsSixVertical,
  DotsThreeVertical,
} from "@phosphor-icons/react";

import classNames from "classnames";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";

type Props = {
  id: string;
  title: string;
  visible?: boolean;
  description?: string;
  children?: React.ReactNode;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
};
const DropdownItemCRUD = dynamic(
  () => import("./item-crud").then((module) => module.DropdownItemCRUD),
  { ssr: false }
);

export const SectionListItem = ({
  id,
  title,
  visible = true,
  description,
  children,
  onDuplicate,
  onDelete,
  onToggleVisibility,
}: Props) => {
  const [openCollapse, setOpenCollapse] = useState<boolean>(false);
  const [showCRUD, setShowCRUD] = useState<boolean>(false);

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 100 : undefined,
    transition,
  };

  return (
    <motion.section
      ref={setNodeRef}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex items-center"
    >
      <div
        style={style}
        className="flex items-center gap-3 w-full relative"
        onMouseEnter={() => setShowCRUD(true)}
        onMouseLeave={() => setShowCRUD(false)}
      >
        <div
          className={classNames(
            "bg-white my-2 rounded-lg p-4 w-full",
            !visible && "bg-gray-300"
          )}
          style={{ border: "1px solid #C4C4C4" }}
        >
          <div className="flex flex-col transition-opacity">
            <div className="w-full text-sm text-left flex gap-2 items-center">
              <div
                {...listeners}
                {...attributes}
                className="flex left-[-10px] cursor-pointer w-5 relative items-center justify-center"
              >
                <DotsSixVertical weight="bold" size={12} />
              </div>
              <div
                className="hover:text-secondary-main cursor-pointer flex flex-1"
                onClick={() => setOpenCollapse(!openCollapse)}
              >
                <div className="flex gap-1 items-center flex-1">
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                  -
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: description as string }}
                  />
                </div>
                {openCollapse ? (
                  <CaretUp size={20} color="black" weight="thin" />
                ) : (
                  <CaretDown size={20} color="black" weight="thin" />
                )}
              </div>
            </div>

            {openCollapse && (
              <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                {children}
              </Collapse>
            )}
          </div>
        </div>

        <div className="absolute -right-8">
          <DropdownItemCRUD
            visible={visible}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onToggleVisibility={onToggleVisibility}
          >
            <div
              className="p-1 cursor-pointer rounded-full bg-transparent hover:bg-gray-100 "
              style={{
                opacity: showCRUD ? 1 : 0,
              }}
            >
              <DotsThreeVertical weight="bold" size={20} />
            </div>
          </DropdownItemCRUD>
        </div>
      </div>
    </motion.section>
  );
};
