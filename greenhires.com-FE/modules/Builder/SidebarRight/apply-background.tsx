import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/interfaces/general/category";
import { useEditor } from "@/lib/design-editor";
import Slider from "@/lib/design-editor/common/slider/Slider";
import { BackgroundList } from "@/modules/Background/BackgroundList";
import { useEffect, useState } from "react";

interface ApplyBackgroundProps {
  categories: Category[];
}

export const ApplyBackground = ({ categories }: ApplyBackgroundProps) => {
  const [bgType, setBgType] = useState("default");

  const [bg, setBg] = useState({
    url: "",
    rotate: 0,
    opacity: 1,
  });

  const { actions } = useEditor((state, _) => state);

  useEffect(() => {
    if (bg.url) {
      actions.changeBackgroundImage(bg.url, bg.rotate, bg.opacity);
    }
  }, [bg]);
  const handleChangeRotate = (value: number) => {
    setBg({ ...bg, rotate: value });
  };

  const handleChangeOpacity = (value: number) => {
    setBg({ ...bg, opacity: value });
  };

  return (
    <>
      {/* <Tabs
        onValueChange={(val) => setBgType(val)}
        defaultValue="default"
        className="w-[400px] rounded-full"
      >
        <TabsList>
          <TabsTrigger value="default">Change Background</TabsTrigger>
          <TabsTrigger value="ai">AI Generate Background</TabsTrigger>
        </TabsList>
      </Tabs> */}

      <div className="flex justify-center gap-10 p-4">
        <div className="min-w-[200px]">
          <Slider
            label={"Rotate Background"}
            min={-180}
            max={180}
            value={bg.rotate}
            onChange={handleChangeRotate}
          />
        </div>

        <div className="min-w-[200px]">
          <Slider
            label={"Opacity"}
            value={bg.opacity}
            onChange={handleChangeOpacity}
          />
        </div>
      </div>

      <BackgroundList
        categories={categories}
        onAction={(data) => setBg({ ...bg, url: data.url })}
        selectedBackground={bg.url}
        bgType={bgType}
        title="Switch Background"
        numLimit={26}
        isShowCheck
      />
    </>
  );
};
