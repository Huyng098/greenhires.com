import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultTones } from "@/constants/tone";
import {
  AIGenerationParagraph,
  AIGenerationParagraphType,
} from "@/interfaces/resume/ai";
import { generateParagraph } from "@/services/openai/ai-paraph";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircularProgress } from "@mui/material";
import {
  ArrowCounterClockwise,
  PaperPlaneRight,
  Paragraph,
  X,
} from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeywordsInput } from "./Keywords";
import { RecommendOptions } from "./RecommendOptions";
const LanguageOptions = dynamic(
  () => import("./Language").then((module) => module.LanguageOptions),
  { ssr: false }
);
interface ChatboxProps {
  option: string;
  job_title: string;
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
  onChangeText: (value: string, isMinus: boolean) => void;
  initialTopic?: string;
}
const topics = [
  "About Me",
  "Education",
  "Experience",
  "Language",
  "Award",
  "Hobby",
  "Certification",
  "Custom Section",
];

export function GenerateParagraph({
  option,
  job_title,
  setOption,
  onChangeText,
  initialTopic,
}: ChatboxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [listKeyword, setListKeyword] = useState<string[]>([]);
  const [recomTexts, setRecomTexts] = useState<string[]>([]);
  const [recomStates, setRecomStates] = useState<boolean[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<AIGenerationParagraphType>({
    resolver: zodResolver(AIGenerationParagraph),
    defaultValues: {
      topic: initialTopic,
      tone: "",
      language: "",
      description: "",
      keywords: "",
    },
  });

  const handleGenerateParagraph = async (isRetry: boolean = false) => {
    const data = { ...getValues(), keywords: listKeyword.join(",") };
    try {
      setIsLoading(true);
      const result = await generateParagraph({
        info: data,
        job_title,
        format_style: "",
        isRetry: isRetry,
      });
      const sentences = JSON.parse(result)["sentences"];
      setRecomTexts(sentences);
      setRecomStates(new Array(sentences.length).fill(false));
    } catch (error) {
      console.log("Error when calling OpenAI: ", error);
      setRecomTexts([]);
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit() {
    await handleGenerateParagraph();
  }
  function handleChangeText(recomText: string, idx: number): void {
    onChangeText(recomText, recomStates[idx]);
    setRecomStates((prev) => {
      return prev.map((state, index) => (index === idx ? !state : state));
    });
  }

  return (
    <>
      <Popover open={option === "paragraph"}>
        <PopoverTrigger></PopoverTrigger>
        <PopoverContent side="right" sideOffset={100} className="w-[38rem] p-2">
          <div
            onClick={() => setOption(null)}
            className="hover:text-secondary-main w-full flex justify-end"
          >
            <X size={16} weight="light" />
          </div>
          <div className="flex items-center">
            <Paragraph size={25} color="#19B2B9" weight="light" />
            <p className="font-bold ml-2">AI Generate Paragraph</p>
          </div>
          {isLoading ? (
            <div className="flex justify-center h-[250px] items-center">
              <CircularProgress size="2rem" style={{ color: "#9ca3af" }} />
            </div>
          ) : recomTexts.length === 0 ? (
            <div className="bg-backgroundColor-third">
              <div className="p-5">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full flex flex-col gap-2"
                >
                  <div className="flex mb-5 items-center gap-2">
                    <Image
                      src="/icons/chatbot.svg"
                      alt="chatbot"
                      width={40}
                      height={40}
                    />
                    <div className="h-fit bg-[#EEEEEE] w-fit p-[5px] rounded-lg">
                      Please choose suitable options
                    </div>
                  </div>
                  <div>
                    <p>Topic</p>
                    <Controller
                      name="topic"
                      control={control}
                      render={({ field }) => (
                        <Select
                          defaultValue={initialTopic}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {topics.map((topic, idx) => (
                              <SelectItem key={idx} value={topic}>
                                {topic}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <p>Tone</p>
                    <Controller
                      name="tone"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                          <SelectContent>
                            {defaultTones.map((tone, idx) => (
                              <SelectItem key={idx} value={tone}>
                                {tone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.tone && (
                      <p className="text-red-400">{errors.tone.message}</p>
                    )}
                  </div>
                  <div>
                    <p>Language</p>
                    <Controller
                      name="language"
                      control={control}
                      render={({ field }) => <LanguageOptions field={field} />}
                    />
                    {errors.language && (
                      <p className="text-red-400">{errors.language.message}</p>
                    )}
                  </div>
                  <div>
                    <p>Description</p>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Input
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="What important to mention? Describe main ideas you want to express in the paragraph..."
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="text-red-400">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <KeywordsInput
                    listKeyword={listKeyword}
                    setListKeyword={setListKeyword}
                  />
                  <div>
                    <div className="flex items-center justify-end my-2">
                      <button
                        type="submit"
                        className="flex gap-2 items-center text-secondary-main"
                      >
                        <p>Generate</p>
                        <PaperPlaneRight size={20} weight="fill" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="text-[#828282] mr-2 flex items-center text-sm justify-end ">
                <Button
                  variant={"ghost"}
                  className="hover:text-secondary-main cursor-pointer"
                  onClick={() => handleGenerateParagraph(true)}
                >
                  <ArrowCounterClockwise size={20} weight="light" />
                  <p> Try again </p>
                </Button>
              </div>
              <RecommendOptions
                recomTexts={recomTexts}
                className="min-h-[120px]"
                setRecomTexts={setRecomTexts}
                recomStates={recomStates}
                handleChangeText={handleChangeText}
              />
            </>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
