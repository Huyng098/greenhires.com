import XIcon from "@duyank/icons/regular/X";
import { FC } from "react";
import Page from "../editor/Page";
import { useEditor } from "../hooks/useEditor";

interface PageSettingsProps {
  onClose: () => void;
}

const PageSettings: FC<PageSettingsProps> = ({ onClose }) => {
  const { actions, pages, pageSize } = useEditor((state, query) => {
    return {
      pages: state.pages,
      pageSize: query.getPageSize(),
    };
  });
  const contentWidth = window.innerWidth / 2 - 24 * 1.5 - 3 * 2;
  const scale = contentWidth / pageSize.width;
  const handleChangePage = (pageIndex: number) => {
    actions.setActivePage(pageIndex);
    onClose();
  };
  return (
    <div
      style={{
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        position: "fixed",
        background: "#fff",
        zIndex: 2050,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          height: 48,
          borderBottom: "1px solid rgba(57,76,96,.15)",
          padding: "0 20px",
        }}
      >
        <p
          style={{
            lineHeight: "48px",
            fontWeight: 600,
            color: "#181C32",
            flexGrow: 1,
          }}
        >
          Pages
        </p>
        <div
          style={{
            fontSize: 20,
            flexShrink: 0,
            width: 32,
            height: 32,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => onClose()}
        >
          <XIcon />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,minmax(0,1fr))",
          gridGap: 24,
          padding: 24,
        }}
      >
        {pages.map((page, index) => (
          <div key={index} style={{ position: "relative" }}>
            <div
              style={{
                position: "relative",
                width: pageSize.width * scale + 6,
                height: pageSize.height * scale + 6,
                border: "3px solid #fff",
                boxShadow:
                  "0 0 0 1px rgba(64,87,109,.07),0 2px 8px rgba(57,76,96,.15)",
                borderRadius: 8,
              }}
            >
              <Page
                height={pageSize.height}
                isActive={true}
                pageIndex={index}
                scale={scale}
                width={pageSize.width}
              />
            </div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 2,
              }}
            >
              {index + 1}
            </p>
            <div
              style={{ position: "absolute", inset: 0 }}
              onClick={() => handleChangePage(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default PageSettings;
