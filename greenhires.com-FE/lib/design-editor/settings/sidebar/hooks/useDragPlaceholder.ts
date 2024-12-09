import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const useDragPlaceholder = (
  sortableProps?: ReturnType<typeof useSortable>
) => {
  const { transition, transform, isDragging } = sortableProps || {};

  const getStyles = () => {
    if (sortableProps) {
      return {
        transform: CSS.Transform.toString(transform || null),
        transition,
        zIndex: isDragging ? 1 : "auto",
        opacity: isDragging ? 0.2 : 1,
        touchAction: "none",
      };
    } else {
      return {
        boxShadow: "0px 4px 12px rgb(0 0 0 / 10%)",
      };
    }
  };

  const getContentStyles = () => {
    if (sortableProps) {
      return {
        opacity: sortableProps.isDragging ? 0 : 1,
      };
    }
    return {};
  };

  const styles = getStyles();
  const contentStyles = getContentStyles();

  return { styles, contentStyles };
};
