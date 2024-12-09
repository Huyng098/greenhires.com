import { rewriteText } from "@/services/openai/ai-rewriting";
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

export function RewriteText({
  option,
  setOption,
  initialText,
  onChange,
}: ChatboxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [revised_text, setRevisedText] = useState("");
  const handleRewriteText = async () => {
    if (!initialText) return;
    try {
      setIsLoading(true);
      const revised_text = await rewriteText(initialText);
      setRevisedText(revised_text);
    } catch (error) {
      setRevisedText("Error when calling OpenAI");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleRewriteText();
  }, []);
  return (
    <AITextPopup
      open={option === "rewrite"}
      setOption={setOption}
      onChange={onChange}
      isLoading={isLoading}
      title="Rewrite Text"
      revised_text={revised_text}
      setRevisedText={setRevisedText}
      action={handleRewriteText}
    />
  );
}
