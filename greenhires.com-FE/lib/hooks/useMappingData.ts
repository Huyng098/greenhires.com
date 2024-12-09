import { SectionItem } from "@/interfaces/builder/baseSection";
import { SavingContext } from "@/stores/saving";
import { getVirtualDomHeight } from "@lidojs/design-core";
import { useContext } from "react";
import { TextLayerProps, useEditor } from "../design-editor";
import { setContent } from "../design-editor/common/text-editor/core/helper/setContent";
import { isCanCollide } from "../design-editor/ultils/colision";
import { isSectionLayer } from "../design-editor/ultils/layer/layers";

export const useMappingTemplate = () => {
  const { setSaving } = useContext(SavingContext);
  const { state, actions } = useEditor((state, _) => state);
  const moveDown = (current_id: string, ids: string[], dy: number) => {
    const layers = state.pages[state.activePage].layers;
    ids.map((id) => {
      if (
        current_id !== id &&
        isCanCollide(layers[current_id].data, layers[id].data)
      ) {
        actions.moveDownByDeltaY(id, dy);
      }
    });
  };
  const updateTextLayer = (path: string, value: unknown) => {
    const layers = state.pages[state.activePage].layers;
    if (layers[path]) {
      const data = layers[path].data;
      const section_id = path.includes("basics")
        ? "basics"
        : `sections.${path.split(".")[1]}`;
      if (data.editor) {
        setContent(`${value}`)(data.editor.state, data.editor.dispatch);
        const div = document.createElement("div");
        div.append(data.editor.dom);
        const { clientHeight } = getVirtualDomHeight(
          div,
          data.props.boxSize.width,
          data.props.scale || 1
        );
        const dy = clientHeight - data.props.boxSize.height;
        actions.history
          .merge()
          .setProp<TextLayerProps>(state.activePage, path, {
            ...data.props,
            text: data.editor.dom.innerHTML,
            boxSize: {
              width: data.props.boxSize.width,
              height: clientHeight,
            },
          });
        if (data.parent && data.parent !== "ROOT") {
          if (isSectionLayer(layers[data.parent])) {
            const childs = layers[data.parent].data.child;
            actions.ungroup(data.parent);
            moveDown(path, childs, dy);
            actions.group(childs, data.parent, "SectionLayer");
          } else {
            actions.ungroup(section_id);
            // Ungroup the current item
            const childs_of_section = layers[section_id].data.child;
            const childs_of_item = layers[data.parent].data.child;
            const childs = [
              ...childs_of_section.filter((id) => id !== data.parent),
              ...childs_of_item,
            ];
            actions.ungroup(data.parent);
            moveDown(path, childs, dy);
            // Group item again
            actions.group(childs_of_item, data.parent, "ItemLayer");
            // Group section again
            actions.group(childs_of_section, section_id, "SectionLayer");
          }
        }
        // Move all section down
        Object.entries(layers).forEach(([id, sectionLayer]) => {
          if (
            isSectionLayer(sectionLayer) &&
            id !== section_id &&
            isCanCollide(layers[section_id].data, layers[id].data, false)
          ) {
            actions.moveDownByDeltaY(id, dy);
          }
        });
      }
    }
  };

  const createOrDeleteTextLayer = (
    path: string,
    value: unknown,
    item_id?: string,
    type?: "delete" | "create" | "update"
  ) => {
    const regex = /sections\.(\w+)\.items/g;
    const section_id = `sections.${path.split(".")[1]}`;
    let items: SectionItem;
    if (regex.test(path)) {
      if (type === "create") {
        // Number of items in section > Number of items in layers
        // Only keep the first item if length == 1 or keep all items if length > 1
        if ((value as Array<SectionItem>).length === 1) {
          actions.keepFirstItem(section_id, item_id!);
          items = (value as Array<SectionItem>)[0];
        } else {
          // Add a new item to the section
          actions.addANewItem(section_id, item_id);
          items = (value as Array<SectionItem>).find(
            (item) => item.id === item_id
          )!;
        }
      } else {
        // delete item from section
        actions.deleteItem(section_id, `${section_id}.items[${item_id}]`);
      }
    }
  };
  const mappingData = (
    path: string,
    value: unknown,
    item_id?: string,
    type?: "delete" | "create" | "update"
  ) => {
    setSaving(true);
    if (!item_id && !type) {
      updateTextLayer(path, value);
    } else {
      if (type === "create" || type === "delete") {
        createOrDeleteTextLayer(path, value, item_id, type);
      } else if (type === "update") {
        const new_path = path.replace(/\[(.*?)\]/g, `[${item_id}]`);
        updateTextLayer(new_path, value);
      }
    }
  };

  return { mappingData };
};
