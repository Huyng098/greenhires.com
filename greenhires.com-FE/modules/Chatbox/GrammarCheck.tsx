import { GrammarCheckProps, Mistake } from "@/interfaces/ai";
import { fixGrammar } from "@/services/openai/fix-grammar";
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
  highlightGrammarErrors?: (mistakes: Mistake[]) => void;
}

export function GrammarCheck({
  option,
  setOption,
  initialText,
  highlightGrammarErrors,
  onChange,
}: ChatboxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [revised_text, setRevisedText] = useState("");
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const startFixGrammar = async () => {
    if (!initialText) return;
    try {
      setIsLoading(true);
      const results = await fixGrammar(initialText);
      const { revised_text, mistakes } = JSON.parse(
        results
      ) as GrammarCheckProps;
      setRevisedText(revised_text);
      setMistakes(mistakes);
      if (highlightGrammarErrors) highlightGrammarErrors(mistakes);
    } catch (error) {
      console.error(error);
      setRevisedText("Error when checking grammar");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    startFixGrammar();
  }, []);
  return (
    <AITextPopup
      open={option === "grammar"}
      setOption={setOption}
      onChange={onChange}
      isLoading={isLoading}
      title="Grammar check"
      mistakes={mistakes}
      revised_text={revised_text}
      setRevisedText={setRevisedText}
      action={startFixGrammar}
      isCanTryAgain={false}
    />
  );
}
