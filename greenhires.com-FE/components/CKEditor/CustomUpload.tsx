import { uploadImage } from "@/services/general/api";
import { FileLoader } from "@ckeditor/ckeditor5-upload/src/filerepository";

export class CustomUploader {
  loader: FileLoader; // Add loader property
  uploadImageRequestUrl: string;

  constructor(loader: FileLoader, uploadImageRequestUrl: string) {
    this.loader = loader;
    this.uploadImageRequestUrl = uploadImageRequestUrl;
  }

  upload = async () => {
    try {
      const file = await this.loader.file;

      const formData = new FormData();
      if (file) {
        formData.append("image", file);
        formData.append("type", "general");
      }
      const data = await uploadImage(formData);
      return {
        default: data.url,
      };
    } catch (error) {
      throw error;
    }
  };

  abort() {
    console.log("Upload aborted");
  }
}
