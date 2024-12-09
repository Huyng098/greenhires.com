import { makeLonger } from "@/services/openai/make-longer";
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

export function MakeLonger({
  option,
  setOption,
  initialText,
  onChange,
}: ChatboxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [revised_text, setRevisedText] = useState("");
  const handleMakeLonger = async () => {
    if (!initialText) return;
    try {
      setIsLoading(true);
      const revised_text = await makeLonger(initialText);
      setRevisedText(revised_text);
    } catch (error) {
      setRevisedText("Error when calling OpenAI");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleMakeLonger();
  }, []);
  return (
    <AITextPopup
      open={option === "longer"}
      setOption={setOption}
      onChange={onChange}
      isLoading={isLoading}
      revised_text={revised_text}
      setRevisedText={setRevisedText}
      title="Make longer"
      action={handleMakeLonger}
    />
  );
}
