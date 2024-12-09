import { Loading } from "@/components/Common/Loading";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SectionItem } from "@/interfaces/builder/baseSection";
import { fixFullCheckGrammar } from "@/services/openai/fix-grammar";
import { useResumeStore } from "@/stores/resume";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { useCallback, useMemo, useState } from "react";

const COLOR_PATTERN =
  /color:\s+(#[0-9a-f]{3,8}|(?:rgb|hsl)a?\([^)]+\)|[a-z]+)/gi;
const FONT_FAMILY_PATTERN = /font-family:\s+([^"]+)/g;
const SUMMARY_KEYS = ["summary", "description"];

const collectColorFont = (item: any, isOnlySummary = false) => {
  const colors = new Set<string>();
  const fonts = new Set<string>();

  Object.entries(item).forEach(([key, value]) => {
    if (isOnlySummary && !SUMMARY_KEYS.includes(key)) return;
    if (typeof value !== "string") return;

    const colorMatches = value.match(COLOR_PATTERN);
    const fontMatches = value.match(FONT_FAMILY_PATTERN);
    colorMatches?.forEach((match) => colors.add(match.split(":")[1].trim()));
    fontMatches?.forEach((match) =>
      fonts.add(match.split(":")[1].trim().replaceAll("\\", ""))
    );
  });

  return { colors, fonts };
};

export function AICheckResume({
  isDoing,
  setIsDoing,
}: {
  isDoing: boolean;
  setIsDoing: (value: boolean) => void;
}) {
  const resume_data = useResumeStore()((state) => state.resume.resume_data);
  const [isOpenGrammar, setIsOpenGrammar] = useState(true);
  const [isOpenCF, setIsOpenCF] = useState(true);
  const [detected, setDetected] = useState({
    colors: new Set<string>(),
    fonts: new Set<string>(),
  });
  const [grammarErrors, setGrammarErrors] = useState<string | undefined>(
    undefined
  );
  const startCheckAll = useCallback(() => {
    const sections = [
      resume_data.basics,
      resume_data.sections.aboutme,
      resume_data.sections.education,
      resume_data.sections.experience,
      resume_data.sections.languages,
      resume_data.sections.hobbies,
      resume_data.sections.certifications,
      resume_data.sections.custom,
    ];

    const allColors = new Set<string>();
    const allFonts = new Set<string>();

    sections.forEach((section, idx) => {
      let sectionValues: { colors: Set<string>; fonts: Set<string> };

      if (idx === 0 || idx === 1) {
        sectionValues = collectColorFont(section);
      } else if (idx === sections.length - 1) {
        if (!section) return;
        sectionValues = { colors: new Set(), fonts: new Set() };
        Object.values(section).forEach((value) => {
          value?.items?.forEach((item: SectionItem) => {
            const { colors, fonts } = collectColorFont(item, true);
            colors.forEach((color) => sectionValues.colors.add(color));
            fonts.forEach((font) => sectionValues.fonts.add(font));
          });
        });
      } else {
        sectionValues = { colors: new Set(), fonts: new Set() };
        // @ts-ignore
        section?.items?.forEach((item: SectionItem) => {
          const { colors, fonts } = collectColorFont(item, true);
          colors.forEach((color) => sectionValues.colors.add(color));
          fonts.forEach((font) => sectionValues.fonts.add(font));
        });
      }

      sectionValues.colors.forEach((color) => allColors.add(color));
      sectionValues.fonts.forEach((font) => allFonts.add(font));
    });

    setDetected({ colors: allColors, fonts: allFonts });
  }, [resume_data]);

  const handleAICheckFull = useCallback(async () => {
    setIsDoing(true);
    const grammars = await fixFullCheckGrammar(resume_data);

    setGrammarErrors(grammars);
    startCheckAll();
    setIsDoing(false);
  }, [setIsDoing, startCheckAll]);

  const colorElements = useMemo(
    () =>
      Array.from(detected.colors).map((color, idx) => (
        <div
          key={idx}
          className="rounded-full w-4 h-4"
          style={{ backgroundColor: color }}
        />
      )),
    [detected.colors]
  );

  const fontElements = useMemo(
    () =>
      Array.from(detected.fonts).map((font, idx) => (
        <span
          style={{
            fontFamily: font,
            marginRight: "8px",
          }}
          key={idx}
        >
          {font}
          {idx < detected.fonts.size - 1 ? "," : ""}
        </span>
      )),
    [detected.fonts]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          onClick={handleAICheckFull}
          className="text-white hover:opacity-90 mt-4 w-[100px] left-[-50px] cursor-pointer rounded-l-lg absolute font-medium p-2 text-md bg-gradient-to-b from-[#00B1B8] to-[#31566B]"
        >
          AI Check
        </div>
      </PopoverTrigger>
      <PopoverContent className="lg:w-[700px] bg-[#F1FAFB]">
        {!isDoing ? (
          <>
            <Collapsible
              open={isOpenGrammar}
              onOpenChange={setIsOpenGrammar}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger asChild>
                <div className="cursor-pointer hover:opacity-90 flex items-center text-primary-main justify-between space-x-4 px-4">
                  <h4 className="text-md font-semibold">Grammar</h4>
                  {isOpenGrammar ? (
                    <CaretDown size={20} weight="light" />
                  ) : (
                    <CaretUp size={20} weight="light" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="border-b-[2px] flex gap-2 px-4 py-3 font-mono text-sm">
                  {grammarErrors ? (
                    <div className="max-h-[600px] min-h-[400px] overflow-y-auto">
                      {Object.entries(JSON.parse(grammarErrors)).map(
                        ([key, value]) => (
                          <div
                            className="cursor-pointer hover:bg-slate-50 rounded-md mx-4 p-2 bg-white shadow mt-3 text-sm"
                            key={key}
                            onClick={() => {
                              const section = document.querySelector(`#${key}`);

                              if (section)
                                section?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            <p className="text-primary-main text-lg border-b-[2px] border-slate-200">
                              {key && key[0].toUpperCase() + key.slice(1)}
                            </p>
                            <p className="mt-3">{value as string}</p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p>No grammar errors detected</p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible
              open={isOpenCF}
              onOpenChange={setIsOpenCF}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger asChild>
                <div className="mt-8 cursor-pointer hover:opacity-90 flex items-center text-primary-main justify-between space-x-4 px-4">
                  <h4 className="text-md font-semibold">Color & Font</h4>
                  {isOpenCF ? (
                    <CaretDown size={20} weight="light" />
                  ) : (
                    <CaretUp size={20} weight="light" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="rounded-md items-center flex gap-2 shadow mx-8 bg-white px-4 py-3 font-mono text-sm">
                  <p>Detected colors: </p>
                  <div className="flex gap-2">{colorElements}</div>
                </div>
                <div className="flex items-center rounded-md shadow bg-white px-4 py-3 mx-8 font-mono text-sm">
                  <div>Detected fonts: {fontElements}</div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        ) : (
          <Loading color="primary" />
        )}
      </PopoverContent>
    </Popover>
  );
}
