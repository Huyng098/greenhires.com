import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultLanguages } from "@/constants/language";

interface LanguageOptionsProps {
  field: any;
}

export const LanguageOptions = ({ field }: LanguageOptionsProps) => {
  return (
    <Select defaultValue={field.value} onValueChange={field.onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {defaultLanguages.map((language, idx) => (
          <SelectItem value={language.label} key={idx}>
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
