import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import classNames from "classnames";

interface Props {
  recomTexts: string[];
  recomStates: boolean[];
  className?: string;
  setRecomTexts: (recomTexts: string[]) => void;
  handleChangeText: (recomText: string, idx: number) => void;
}

export const RecommendOptions = ({
  recomTexts,
  setRecomTexts,
  className,
  recomStates,
  handleChangeText,
}: Props) => {
  const handleHandleChangeRecom = (index: number, newText: string) => {
    const updatedTexts = [...recomTexts];
    updatedTexts[index] = newText;
    setRecomTexts(updatedTexts);
  };
  return (
    <div className="h-[300px]">
      <ScrollArea className="h-full bg-backgroundColor-third rounded-lg p-4 text-sm">
        {recomTexts.map((recomText, idx) => (
          <div className="flex bg-[#D9D9D99C] my-2" key={idx}>
            <button
              onClick={() => handleChangeText(recomText, idx)}
              className=" my-3 mx-5 p-2 rounded-md flex items-center"
            >
              {!recomStates[idx] ? (
                <Plus size={25} color="#06B2B9" weight="bold" />
              ) : (
                <Minus size={25} color="red" weight="bold" />
              )}
            </button>
            <Textarea
              className={classNames(
                "bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                className
              )}
              value={recomText}
              onChange={(e) => handleHandleChangeRecom(idx, e.target.value)}
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
