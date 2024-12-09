import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { defaultLanguages } from "@/constants/language";
import { translateResume } from "@/services/openai/translate";
import { useResumeStore } from "@/stores/resume";
import { forwardRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}
export const LanguageTranslation = forwardRef<HTMLDivElement, Props>(
  ({ children }, ref) => {
    const resume_data = useResumeStore()((state) => state.resume.resume_data);
    const lang = useResumeStore()((state) => state.resume.language);
    const [isLoading, setIsLoading] = useState(false);
    const setValue = useResumeStore()((state) => state.setResume);
    const handleTranslateResume = (lang: { label: string; value: string }) => {
      try {
        setIsLoading(true);
        toast.promise(translateResume(resume_data, lang.label), {
          loading: `Translating resume to ${lang.label}, please wait...`,
          success: (data) => {
            setValue("basics.name", data.translated_names[0]);
            data.normal_keys.shift();
            data.translated_names.shift();
            data.normal_keys.map((value, index) => {
              setValue(`sections.${value}.name`, data.translated_names[index]);
            });
            data.custom_keys.map((value, index) => {
              setValue(
                `sections.custom.${value}.name`,
                data.translated_names[index + data.normal_keys.length]
              );
            });
            setValue("language", lang.value);
            return `Translated resume to ${lang.label} successfully!`;
          },
          error: "Error occurred while translating resume",
          finally: () => setIsLoading(false),
        });
      } catch (error) {
        console.log("error", error);
      }
    };
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent ref={ref} className="z-[9999]">
          {defaultLanguages.map((language) => (
            <DropdownMenuCheckboxItem
              key={language.value}
              checked={language.value === lang}
              disabled={language.value === lang || isLoading}
              onClick={() => handleTranslateResume(language)}
            >
              {language.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
