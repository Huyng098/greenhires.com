import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

interface Props {
  listKeyword: string[];
  setListKeyword: (listKeywords: string[]) => void;
}

export const KeywordsInput = ({ listKeyword, setListKeyword }: Props) => {
  const [keyword, setKeyword] = useState<string>("");
  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13 && e.target.value !== "") {
      e.preventDefault();
      setListKeyword([...listKeyword, keyword]);
      setKeyword("");
    }
  };
  const handleDeleteKeyword = (index: number) => {
    const newList = [...listKeyword];
    newList.splice(index, 1);
    setListKeyword(newList);
  };
  return (
    <div>
      <p>Keywords</p>
      <Input
        className="bg-white"
        placeholder="Enter your keywords"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <p className="text-sm text-[#828282] my-2">
        You can input keywords you want to show and press enter to separate them
      </p>
      <div className="flex flex-wrap gap-3 rounded-lg ">
        {listKeyword.map((item, index) => (
          <div
            className="px-2 py-[1px] rounded-xl bg-gray-200 flex gap-2 items-center text-xs"
            key={index}
          >
            <p>{item}</p>{" "}
            <Button
              type="button"
              variant="ghost"
              className="p-0 m-0 h-5"
              onClick={() => handleDeleteKeyword(index)}
            >
              <X size={13} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
