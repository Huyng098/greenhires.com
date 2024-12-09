"use client";

import { getDefaultResumeCanva } from "@/constants/canva";
import { useEditor } from "@/lib/design-editor";
import DesignFrameLiveEdit from "@/lib/design-editor/editor/DesignFrameLiveEditing";
import { useResumeStore } from "@/stores/resume";
import { PaginationLiveEdit } from "./PaginationLiveEdit";

import { extractUrl, generatePages } from "@/lib/utils";

import { getTemplatePadding } from "@/modules/TemplateDisplay/templates/template-padding";
import { SerializedPage } from "@lidojs/design-core";
import { cloneDeep, mapValues } from "lodash";
import { useEffect, useRef } from "react";

const EditorContentLiveEdit = () => {
  const resume_canva = useResumeStore()((state) => state.resume.resume_canva);
  const resume_data = useResumeStore()((state) => state.resume.resume_data);
  const setPages = useResumeStore()((state) => state.setPages);
  const resume_id = useResumeStore()((state) => state.resume.id);
  const { actions, query } = useEditor((state, _) => state);
  const containerRef = useRef<HTMLDivElement>(null);
  console.log(resume_canva);
  useEffect(() => {
    if (!containerRef.current) return;
    const padding = getTemplatePadding(resume_data.metadata.template);
    const pageList = generatePages(
      containerRef,
      padding.top,
      padding.right,
      padding.bottom,
      padding.left
    );

    const defaultBgPage1 =
      extractUrl(
        window
          .getComputedStyle(containerRef.current)
          .getPropertyValue("--bg-page-1")
      ) ?? "";
    const defaultBgPage2 =
      extractUrl(
        window
          .getComputedStyle(containerRef.current)
          .getPropertyValue("--bg-page-2")
      ) ?? "";

    let initialValue = query.serialize().length;
    let newPages: SerializedPage[] = cloneDeep(query.serialize());
    while (pageList.length > initialValue) {
      newPages.push(...getDefaultResumeCanva(initialValue, resume_id));
      initialValue++;
    }
    while (pageList.length < initialValue) {
      const page = newPages[initialValue - 1];
      if (Object.keys(page.layers).length === 2) {
        newPages.splice(initialValue - 1, 1);
      }
      initialValue--;
    }
    if (pageList.length <= initialValue) {
      newPages = newPages.map((page, index) => {
        return {
          ...page,
          layers: mapValues(page.layers, (layer, _) => {
            if (layer.type.resolvedName === "RootLayer") {
              return {
                ...layer,
                props: {
                  ...layer.props,
                  image: {
                    url: index > 0 ? defaultBgPage2 : defaultBgPage1,
                    thumb: index > 0 ? defaultBgPage2 : defaultBgPage1,
                    boxSize: layer.props.boxSize,
                    position: {
                      x: 0,
                      y: 0,
                    },
                    rotate: 0,
                    transparency: 1,
                  },
                },
              };
            }
            if (layer.type.resolvedName === "ResumeLayer") {
              return {
                ...layer,
                props: {
                  ...layer.props,
                  pageNumber: index,
                },
              };
            }
            return layer;
          }),
        };
      });
      // actions.setData(newPages);
    }
    setPages(pageList);
    return () => {
      pageList?.forEach((page) => {
        page.remove();
      });
    };
  }, [containerRef.current, resume_data]);

  return (
    <>
      <DesignFrameLiveEdit data={resume_canva} />
      <PaginationLiveEdit ref={containerRef} resume_data={resume_data} />
    </>
  );
};

export default EditorContentLiveEdit;
