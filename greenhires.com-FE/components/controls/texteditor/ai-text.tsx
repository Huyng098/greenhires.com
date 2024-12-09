import { Mistake } from "@/interfaces/ai";
import dynamic from "next/dynamic";

const AIOptions = dynamic(
  () =>
    import("@/modules/Chatbox/AIOptions").then((module) => module.AIOptions),
  { ssr: false }
);

const GrammarCheckDialog = dynamic(
  () =>
    import("@/modules/Chatbox/GrammarCheck").then(
      (module) => module.GrammarCheck
    ),
  { ssr: false }
);

const GenerateParagraphDialog = dynamic(
  () =>
    import("@/modules/Chatbox/GenerateParagraph").then(
      (module) => module.GenerateParagraph
    ),
  { ssr: false }
);

const MakeShorterDialog = dynamic(
  () =>
    import("@/modules/Chatbox/MakeShorter").then(
      (module) => module.MakeShorter
    ),
  { ssr: false }
);
const MakeLongerDialog = dynamic(
  () =>
    import("@/modules/Chatbox/MakeLonger").then((module) => module.MakeLonger),
  { ssr: false }
);
const GenerateTextDialog = dynamic(
  () =>
    import("@/modules/Chatbox/GenerateText").then(
      (module) => module.GenerateText
    ),
  { ssr: false }
);

const RewriteDialog = dynamic(
  () =>
    import("@/modules/Chatbox/RewriteText").then(
      (module) => module.RewriteText
    ),
  { ssr: false }
);

interface Props {
  onChange: (value: string) => void;
  initialText: string;
  job_title: string;
  onChangeText: (value: string, isMinus: boolean) => void;
  topic?: string;
  aiOpen: boolean;
  setAIOpen: (value: boolean) => void;
  children?: React.ReactNode;
  className?: string;
  highlightGrammarErrors?: (mistakes: Mistake[]) => void;
  option:
    | "grammar"
    | "shorter"
    | "longer"
    | "text"
    | "paragraph"
    | "rewrite"
    | null;
  setOption: (
    value:
      | "grammar"
      | "shorter"
      | "longer"
      | "text"
      | "paragraph"
      | "rewrite"
      | null
  ) => void;
}

export const AIText = ({
  initialText,
  job_title,
  onChangeText,
  className,
  onChange,
  topic,
  aiOpen,
  setAIOpen,
  option,
  setOption,
  highlightGrammarErrors,
  children,
}: Props) => {
  return (
    <div className={className}>
      {children}

      {aiOpen && (
        <AIOptions setOption={setOption} open={aiOpen} setOpen={setAIOpen} />
      )}
      {option === "grammar" && (
        <GrammarCheckDialog
          option={option}
          setOption={setOption}
          initialText={initialText}
          onChange={onChange}
          highlightGrammarErrors={highlightGrammarErrors}
        />
      )}
      {option === "shorter" && (
        <MakeShorterDialog
          option={option}
          setOption={setOption}
          initialText={initialText}
          onChange={onChange}
        />
      )}
      {option === "longer" && (
        <MakeLongerDialog
          option={option}
          setOption={setOption}
          initialText={initialText}
          onChange={onChange}
        />
      )}
      {option === "text" && (
        <GenerateTextDialog
          job_title={job_title}
          option={option}
          setOption={setOption}
          onChangeText={onChangeText}
          initialTopic={topic}
        />
      )}
      {option === "paragraph" && (
        <GenerateParagraphDialog
          job_title={job_title}
          option={option}
          setOption={setOption}
          onChangeText={onChangeText}
          initialTopic={topic}
        />
      )}
      {option === "rewrite" && (
        <RewriteDialog
          option={option}
          setOption={setOption}
          initialText={initialText}
          onChange={onChange}
        />
      )}
    </div>
  );
};
