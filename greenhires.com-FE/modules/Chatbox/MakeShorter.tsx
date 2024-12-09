import { makeShorter } from "@/services/openai/make-shorter";
import { useEffect, useState } from "react";
import { AITextPopup } from "./AITextPopup";

interface ChatboxProps {
  option: string;
  setOption: (
    value:
      | "text"
      | "grammar"
      | "shorter"
      | "longer"
      | "paragraph"
      | "rewrite"
      | null
  ) => void;
  initialText: string;
  onChange: (value: string) => void;
}

export function MakeShorter({
  option,
  setOption,
  initialText,
  onChange,
}: ChatboxProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [revised_text, setRevisedText] = useState("");
  const handleMakeShorter = async () => {
    if (!initialText) return;
    try {
      setIsLoading(true);
      const revised_text = await makeShorter(initialText);
      setRevisedText(revised_text);
    } catch (error) {
      setRevisedText("Error when calling OpenAI");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleMakeShorter();
  }, []);
  return (
    <AITextPopup
      open={option === "shorter"}
      setOption={setOption}
      onChange={onChange}
      isLoading={isLoading}
      title="Make shorter"
      revised_text={revised_text}
      setRevisedText={setRevisedText}
      action={handleMakeShorter}
    />
  );
}
