"use client";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { FileLoader } from "@ckeditor/ckeditor5-upload/src/filerepository";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { useEffect, useState } from "react";

// mui
import { Backdrop, CircularProgress } from "@mui/material";
import { CustomUploader } from "./CustomUpload";
import { fontFamilies } from "./font-families";
import { fontSize } from "./font-size";
import { defaultOption, extendedOption } from "./toolbar-option";

type KeyValuePair = {
  [key: string]: any;
};

interface TextEditorProps {
  propRef?: any;
  initialData: string;
  onChange?: (data: string) => void;
  noEdit?: boolean;
  readonly?: boolean;
  isTitle?: boolean;
  height?: string;
  onReady?: () => void;
  onError?: () => void;
  uploadImageRequestHeader?: KeyValuePair;
  uploadImageRequestUrl?: string;
}

const TextEditor = ({
  propRef,
  initialData,
  onChange,
  noEdit = false,
  readonly = false,
  isTitle = false,
  height,
  onReady,
  onError,
  uploadImageRequestHeader,
  uploadImageRequestUrl = "",
}: TextEditorProps) => {
  const style = {
    "--ck-custom-height": height || "auto",
  } as React.CSSProperties;

  const [isReady, setIsReady] = useState<boolean>(false);
  const uploadImageRequestHeader_ =
    typeof uploadImageRequestHeader !== "undefined"
      ? uploadImageRequestHeader
      : {
          "X-CSRF-TOKEN": "CSRF-Token",
        };

  const uploadAdapterPlugin = (editor: any) => {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: FileLoader
    ) => {
      return new CustomUploader(loader, uploadImageRequestUrl);
    };
  };

  useEffect(() => {
    setIsReady(true);
  }, []);

  return isReady ? (
    <div style={style}>
      <CKEditor
        id="blog_editor"
        disabled={noEdit}
        editor={Editor}
        data={initialData}
        config={{
          menuBar: {
            isVisible: !isTitle && !readonly,
          },
          toolbar: [
            ...defaultOption,
            ...(isTitle ? [] : ["|", ...extendedOption]),
          ],
          extraPlugins: [],
          removePlugins: ["Title"],
          fontFamily: {
            options: ["default", ...fontFamilies],
            supportAllValues: true,
          },
          fontSize: {
            options: fontSize,
          },
        }}
        onReady={(editor: any) => {
          if (readonly) {
            editor.ui.view.toolbar.element.style.display = "none";
            editor.ui.view.editable.element.style.border = "none";
          }
          if (typeof onReady !== "undefined") onReady();
          editor.plugins.get("FileRepository").createUploadAdapter = (
            loader: FileLoader
          ) => {
            return new CustomUploader(loader, uploadImageRequestUrl);
          };
          editor.model.document.on("change:data", () => {
            const changes = editor.model.document.differ.getChanges();
            changes.forEach((change: any) => {
              if (change.type === "remove") {
                if (change.name === "imageBlock") {
                  console.log("Image removed");
                }
              }
            });
          });
          if (propRef) propRef.current = editor;
        }}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          if (onChange) {
            onChange(data);
          }
        }}
        onError={(error: any, details: any) => {
          if (typeof onError !== "undefined") onError();
          console.log({ error, details });
        }}
      />
    </div>
  ) : (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={!isReady}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default TextEditor;
