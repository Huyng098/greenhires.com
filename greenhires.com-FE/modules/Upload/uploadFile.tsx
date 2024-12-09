import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { FilePond, registerPlugin } from "react-filepond";

import { FilePondFile } from "filepond";
import "./upload.css";
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

interface UploadProps {
  files: any;
  maxFiles: number;
  allowMultiple: boolean;
  acceptFileTypes: string[];
  onChange: (items: FilePondFile[]) => void;
  text?: string;
}

export const UploadFilePond = ({
  files,
  maxFiles,
  acceptFileTypes,
  allowMultiple,
  onChange,
  text,
}: UploadProps) => {
  return (
    <FilePond
      required
      files={files}
      onupdatefiles={onChange}
      maxFiles={maxFiles}
      allowFileSizeValidation={true}
      maxFileSize="5MB"
      maxTotalFileSize="50MB"
      instantUpload={false}
      acceptedFileTypes={acceptFileTypes}
      allowMultiple={allowMultiple}
      fileValidateTypeDetectType={(source, type) =>
        new Promise((resolve, reject) => {
          resolve(type);
        })
      }
      dropValidation={true}
      credits={false}
      name="files"
      labelIdle={`<div class="flex flex-col items-center gap-3">
      <p>Drag & Drop here <span class="font-bold">or</span></p>
      <span class="flex flex-row gap-4 items-center 
      bg-primary-main hover:bg-primary-main/85 py-2
      px-8 text-white font-bold no-underline rounded-3xl cursor-pointer">Select ${text ? text : "file"}</span>
    </div>`}
    />
  );
};
