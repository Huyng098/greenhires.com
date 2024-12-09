import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Mistake } from "@/interfaces/ai";

import { CircularProgress } from "@mui/material";
import { ArrowCounterClockwise, ArrowRight } from "@phosphor-icons/react";
import { ArrowCircleRight, Check, X } from "@phosphor-icons/react/dist/ssr";

interface AIPopupProps {
  open: boolean;
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
  onChange: (value: string) => void;
  isLoading: boolean;
  revised_text: string;
  mistakes?: Mistake[];
  setRevisedText: (value: string) => void;
  title: string;
  action: () => void;
  isCanTryAgain?: boolean;
}

export const AITextPopup = ({
  open,
  setOption,
  onChange,
  isLoading,
  revised_text,
  setRevisedText,
  action,
  mistakes,
  title,
  isCanTryAgain = true,
}: AIPopupProps) => {
  return (
    <Popover open={open}>
      <PopoverTrigger></PopoverTrigger>
      <PopoverContent side="right" sideOffset={100} className="w-[30rem] p-2">
        <div className="hover:text-secondary-main w-full flex justify-end">
          <X size={16} onClick={() => setOption(null)} weight="regular" />
        </div>
        <div className="flex items-center">
          <Check size={25} color="#19B2B9" weight="light" />
          <p className="font-bold ml-2">{title}</p>
        </div>
        <div className="p-2">
          {isLoading ? (
            <div className="flex justify-center">
              <CircularProgress size="2rem" style={{ color: "#9ca3af" }} />
            </div>
          ) : (
            <>
              {isCanTryAgain && (
                <div
                  onClick={action}
                  className="text-[#828282] cursor-pointer hover:text-secondary-main mr-2 flex items-center text-sm justify-end "
                >
                  <ArrowCounterClockwise size={16} weight="light" />
                  <p> Try again </p>
                </div>
              )}
              {mistakes && (
                <>
                  <h3 className="text-secondary-main text-base">Mistakes</h3>
                  <div className="max-h-[200px] overflow-y-auto">
                    <div className="space-y-2 text-sm p-3">
                      {mistakes.map((mistake, index) => (
                        <div
                          key={index}
                          className="shadow bg-slate-200 rounded-md p-2"
                        >
                          <div>
                            <p>{mistake.explanation}</p>
                            <div className="flex gap-2 justify-center items-center">
                              <p className="text-red-500">{mistake.original}</p>
                              <ArrowRight size={20} weight="light" />
                              <p className="text-green-500">
                                {mistake.corrected}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <h3 className="text-secondary-main text-base mt-5">
                Improvements
              </h3>
              <Textarea
                onChange={(e) => setRevisedText(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[150px] mb-3"
                value={revised_text}
              />
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="hover:text-white hover:bg-secondary-main"
                  onClick={() => onChange(revised_text)}
                >
                  <p className="mr-2">Apply</p>
                  <ArrowCircleRight size={16} weight="fill" />
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
