import { useExportResume } from "@/services/resume/query";
import { useExportSample } from "@/services/sample/query";
import { toast } from "sonner";

export const useExport = (
  resume_id: string,
  setIsDownloading: (value: boolean) => void,
  type: "resume" | "sample" = "resume"
) => {
  const { exportResume } = useExportResume();
  const { exportSample } = useExportSample();
  const openInNewTab = (url: string) => {
    const win = window.open(url, "_blank");
    if (win) win.focus();
  };

  const onExportToPDF = async () => {
    try {
      setIsDownloading(true);
      const func = type === "resume" ? exportResume : exportSample;
      toast.promise(func({ id: resume_id, format: "pdf" }), {
        loading: "Downloading...",
        success: (resume_url) => {
          if (resume_url.url) {
            openInNewTab(resume_url.url);
            return `Download PDF successfully!`;
          }
        },
        error: "Error",
        finally: () => {
          setIsDownloading(false);
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  const onExportToDOCX = async () => {};
  const onExportToTXT = async () => {
    try {
      setIsDownloading(true);
      toast.promise(exportResume({ id: resume_id, format: "txt" }), {
        loading: "Downloading...",
        success: (resume_url) => {
          if (resume_url.url) {
            openInNewTab(resume_url.url);
            return `Download TXT successfully!`;
          }
        },
        error: "Error",
        finally: () => {
          setIsDownloading(false);
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  return {
    onExportToPDF,
    onExportToDOCX,
    onExportToTXT,
  };
};
